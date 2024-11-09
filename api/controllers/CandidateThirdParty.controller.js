const manageCandidateThirdPartyModel = require("../models/CandidateThirdParty.model")
const status = require("../config/status");
const fs = require('fs'); // Importing fs with promises
const path = require('path')
const csv = require('csv-parser');
const csvtojson = require('csvtojson');
const nodemailer = require('nodemailer');
const axios = require('axios');
const apiBaseUrl = 'https://www.reinforcewebsol.com/Api/jobform.php';

const { parse } = require('json2csv');
const docxConverter = require('docx-pdf');

const FormData = require('form-data');
const stream = require('stream');
const { promisify } = require('util');

const pipeline = promisify(stream.pipeline);

//  exports.listing = async (req, res) => {
//      try {
//          // Fetch the .docx file from the external API
//          const response = await axios({
//              url: 'https://www.reinforcewebsol.com/Api/jobform.php',
//              method: 'GET',
//              responseType: 'arraybuffer' // Get the raw file data
//          });

//          // Save the .docx file temporarily
//          const docxFilePath = path.join(__dirname, 'temp.docx');
//          fs.writeFileSync(docxFilePath, response.data);

//          // Prepare the file for upload
//          const form = new FormData();
//          form.append('file', fs.createReadStream(docxFilePath));

//          // Use CloudConvert API to convert .docx to PDF
//          const apiKey = 'YOUR_CLOUDCONVERT_API_KEY';
//          const convertResponse = await axios.post('https://api.cloudconvert.com/v2/convert', form, {
//              headers: {
//                  ...form.getHeaders(),
//                  'Authorization': `Bearer ${apiKey}`
//              }
//          });

//          // Poll for conversion status
//          let conversionStatus = 'pending';
//          let pdfUrl = '';

//          while (conversionStatus === 'pending') {
//              const statusResponse = await axios.get(`https://api.cloudconvert.com/v2/jobs/${convertResponse.data.id}`, {
//                  headers: {
//                      'Authorization': `Bearer ${apiKey}`
//                  }
//              });

//              conversionStatus = statusResponse.data.data.status;
//              if (conversionStatus === 'finished') {
//                  pdfUrl = statusResponse.data.data.tasks[1].result.files[0].url;
//              } else if (conversionStatus === 'failed') {
//                  throw new Error('Conversion failed');
//              }

//              // Delay before polling again
//              await new Promise(resolve => setTimeout(resolve, 5000));
//          }

//          // Fetch the converted PDF file
//          const pdfResponse = await axios({
//              url: pdfUrl,
//              method: 'GET',
//              responseType: 'arraybuffer'
//          });

//          // Clean up temporary files
//          fs.unlinkSync(docxFilePath);

//          // Send the PDF file in response
//          res.setHeader('Content-Type', 'application/pdf');
//          res.send(pdfResponse.data);

//      } catch (err) {
//          res.json({
//              success: false,
//              status: 500,
//              err: err.message,
//              msg: 'Fetching and converting data failed.'
//          });
//      }
//  };

// third party api
exports.listing = async (req, res) => {
    try {
        // Fetch data from the external API
        const response = await axios.get('https://www.reinforcewebsol.com/Api/jobform.php');
        const externalData = response.data;

        // Return the external data in the response
        return res.json({
            data: externalData,
            success: true,
            status: status.OK
        });
    } catch (err) {
        return res.json({
            success: false,
            status: status.INTERNAL_SERVER_ERROR,
            err: err.message,
            msg: 'Fetching data from external API failed.'
        });
    }
};


exports.candidatebyapigetDataById = async (req, res) => {
    const id = req.params.id;
    try {
        // Fetch data from the external API
        const response = await axios.get(`https://www.reinforcewebsol.com/Api/jobform.php?id=${id}`);
        const externalData = response.data;

        // Log the entire data to inspect its structure
        console.log(externalData);

        // Check if the data has the 'data' key containing an array
        if (externalData.status === 'success' && Array.isArray(externalData.data)) {
            // Find the item with the matching ID
            const item = externalData.data.find(data => data.id === id);

            if (!item) {
                return res.status(status.NOT_FOUND).json({
                    success: false,
                    status: status.NOT_FOUND,
                    msg: 'Item not found.'
                });
            }

            return res.json({
                data: item,
                success: true,
                status: status.OK
            });
        } else {
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                success: false,
                status: status.INTERNAL_SERVER_ERROR,
                msg: 'Unexpected data format from external API.'
            });
        }
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: status.INTERNAL_SERVER_ERROR,
            err: err.message,
            msg: 'Fetching data from external API failed.'
        });
    }
};


// 

exports.deleteThirdParty = async (req, res) => {
    try {
        const ID = req.query.id; // Get the ID from query parameters
        if (!ID) {
            return res.status(400).json({ success: false, msg: 'Id parameter not available' });
        }

        // Send DELETE request to the third-party API
        const response = await axios.delete(`https://www.reinforcewebsol.com/Api/jobform.php/${ID}`);

        // Check if the response indicates success
        if (response.status === 200) {
            return res.json({
                success: true,
                message: 'Record deleted successfully.'
            });
        } else {
            return res.status(response.status).json({
                success: false,
                message: 'Failed to delete the record.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting record.',
            error: error.message
        });
    }
};

exports.export = async (req, res) => {
    const { csvData, filename } = req.body;

    if (!csvData || !filename) {
        console.error('Missing csvData or filename');
        return res.status(400).json({ error: 'Missing csvData or filename' });
    }

    const filePath = path.join(__dirname, 'download', filename);

    try {
        // Convert CSV to JSON
        const jsonData = await csvtojson().fromString(csvData);

        // Remove the _id field from each document
        const modifiedData = jsonData.map(({ _id, ...rest }) => rest);

        // Convert JSON back to CSV
        const csv = parse(modifiedData);

        console.log(`Saving file to ${filePath}`); // Log the file path

        fs.writeFile(filePath, csv, (err) => {
            if (err) {
                console.error('Failed to save file:', err); // Log error details
                return res.status(500).json({ error: 'Failed to save file' });
            }
            console.log('File saved successfully'); // Log success
            res.json({ message: 'File saved successfully', path: `/download/${filename}` });
        });
    } catch (error) {
        console.error('Error processing CSV data:', error);
        res.status(500).json({ error: 'Error processing CSV data' });
    }
};

exports.import = async (req, res) => {
    console.log('File:', req.file);
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log('File path:', filePath);
    try {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    console.log('Parsed results:', results);
                    await manageCandidateThirdPartyModel.insertMany(results); // Adjust according to your schema
                    res.status(200).json({ message: 'Data imported successfully' });
                } catch (error) {
                    console.error('Database error:', error);
                    res.status(500).json({ message: 'Error importing data', error });
                } finally {
                    fs.unlinkSync(filePath); // Clean up the uploaded file
                }
            });
    } catch (error) {
        console.error('File processing error:', error);
        res.status(500).json({ message: 'Error processing file', error });
    }
};



exports.search = async (req, res) => {
    const { searchKey } = req.query;

    try {
        // Make a GET request to the API to retrieve all data
        const response = await axios.get(apiBaseUrl);
        const allData = response.data.data; // Access the data array from the response

        // Check if searchKey is provided
        if (!searchKey) {
            // If no searchKey, return all data
            return res.json({ status: 'success', data: allData });
        }

        // Filter the data based on the searchKey across multiple columns
        const filteredData = allData.filter(item => {
            const lowerSearchKey = searchKey.toLowerCase();
            return (
                item.id.toLowerCase().includes(lowerSearchKey) ||
                item.student_name.toLowerCase().includes(lowerSearchKey) ||
                item.student_mobile.includes(lowerSearchKey) ||
                item.student_email.toLowerCase().includes(lowerSearchKey)

            );
        });

        // Send the filtered data as the response
        res.json({ status: 'success', data: filteredData });

    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        res.status(500).json({ error: 'An error occurred while searching' });
    }
};


// exports.sendEmail = async (req, res) => {
//     try {
//         const emails = req.body && req.body.emails ? req.body.emails : [];

//         if (!Array.isArray(emails) || emails.length === 0) {
//             return res.json({ success: false, status: 'INVALID_SYNTAX', msg: 'Invalid email list.' });
//         }

//         const sendMailPromises = emails.map(async (email) => {
//             const mailData = {
//                 to: email,
//                 subject: 'Requirement..Hiring',
//                 text: 'Hello world?',
//                 html: `
//                 <h2>About the Role:</h2>
//                 <p>We are seeking a skilled and passionate Laravel Developer to join our dynamic team. The ideal candidate will have 2-3 years of experience in developing robust and scalable web applications using the Laravel framework.</p>
//                 <h2>Key Responsibilities:</h2>
//                 <ol>
//                     <li>Develop, test, and maintain web applications using Laravel.</li>
//                     <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
//                     <li>Troubleshoot, test, and maintain the core product software and databases to ensure strong optimization and functionality.</li>
//                 </ol>
//                 <h2>Required Skills:</h2>
//                 <ul>
//                     <li>2-3 years of experience in Laravel development.</li>
//                     <li>Strong knowledge of PHP Framework.</li>
//                     <li>Experience with front-end technologies such as JavaScript, HTML, and CSS.</li>
//                     <li>Familiarity with version control tools (e.g., Git).</li>
//                     <li>Knowledge of database design and querying using MySQL.</li>
//                 </ul>
//                 <h2>Why Join Us:</h2>
//                 <ul>
//                     <li>Opportunity to work on exciting projects with a talented team.</li>
//                     <li>Competitive salary and benefits package.</li>
//                     <li>Continuous learning and professional development opportunities.</li>
//                     <li>Positive and inclusive work environment.</li>
//                 </ul>
//                 <p>Thank you</p>
//                 `
//             };

//             try {
//                 const response = await axios.post('https://www.reinforcewebsol.com/Api/jobform.php', mailData);
//                 console.log(`Message sent to ${email}:`, response.data);
//                 return `Message sent to ${email}`;
//             } catch (error) {
//                 console.error(`Error sending mail to ${email}:`, error);
//                 return `Error sending mail to ${email}: ${error.message}`;
//             }
//         });

//         const results = await Promise.all(sendMailPromises);

//         res.json({ success: true, status: 'OK', msg: 'Emails sent to the provided email addresses.', results });

//     } catch (e) {
//         console.log("Error:", e);
//         return res.json({ success: false, status: 'INVALID_SYNTAX', err: e, msg: 'Error in sending emails.' });
//     }
// };

exports.sendEmail = async (req, res) => {
    try {
        const emails = req.body && req.body.emails ? req.body.emails : [];
        if (!Array.isArray(emails) || emails.length === 0) {
            return res.json({ success: false, status: 'INVALIDSYNTAX', msg: 'Invalid email list.' });
        }
        // Create the transporter object
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mahimagarg1602@gmail.com',
                pass: 'uixv laul bjpd tqcc'
            }
        });

        const sendMailPromises = emails.map(async (email) => {
            const user = await manageCandidateThirdPartyModel.findOne({ student_email: new RegExp(`^${email}$`, 'i') }).lean().exec();

            if (!user) {
                console.log(`User not found in database: ${email}`);
            }

            const mailOptions = {
                from: 'mailto:mahimagarg1602@gmail.com',
                to: email,
                subject: 'Requirement..Hiring',
                text: 'Hello world?',
                html: `
                    <h2>About the Role:</h2>
                    <p>We are seeking a skilled and passionate Laravel Developer to join our dynamic team. The ideal candidate will have 2-3 years of experience in developing robust and scalable web applications using the Laravel framework.</p>
                    <h2>Key Responsibilities:</h2>
                    <ol>
                        <li>Develop, test, and maintain web applications using Laravel.</li>
                        <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
                        <li>Troubleshoot, test, and maintain the core product software and databases to ensure strong optimization and functionality.</li>
                    </ol>
                    <h2>Required Skills:</h2>
                    <ul>
                        <li>2-3 years of experience in Laravel development.</li>
                        <li>Strong knowledge of PHP Framework.</li>
                        <li>Experience with front-end technologies such as JavaScript, HTML, and CSS.</li>
                        <li>Familiarity with version control tools (e.g., Git).</li>
                        <li>Knowledge of database design and querying using MySQL.</li>
                    </ul>
                    <h2>Why Join Us:</h2>
                    <ul>
                        <li>Opportunity to work on exciting projects with a talented team.</li>
                        <li>Competitive salary and benefits package.</li>
                        <li>Continuous learning and professional development opportunities.</li>
                        <li>Positive and inclusive work environment.</li>
                    </ul>
                    <p>Thank you</p>
                `,
            };

            return transporter.sendMail(mailOptions)
                .then(info => {
                    console.log(`Message sent to ${email}: %s`, info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    return `Message sent to ${email}`;
                })
                .catch(error => {
                    console.error(`Error sending mail to ${email}:`, error);
                    return `Error sending mail to ${email}: ${error.message}`;
                });
        });
        const results = await Promise.all(sendMailPromises);

        res.json({ success: true, status: 'OK', msg: 'Emails sent to the provided email addresses.', results });

    } catch (e) {
        console.log("Error:", e);
        return res.json({ success: false, status: 'INVALIDSYNTAX', err: e, msg: 'Error in sending emails.' });
    }
};

  
exports.edit = async (req, res) => {
    var id = req.body._id;
    if (!id) {
        return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
    }

    try {
        // Make a request to the third-party API
        const thirdPartyResponse = await axios.put(`https://www.reinforcewebsol.com/Api/jobform.php/${id}`, {
            student_name: req.body.student_name,
            student_email: req.body.student_email,
            student_mobile: req.body.student_mobile,
            student_qualification: req.body.student_qualification,
            student_exp: req.body.student_exp,
            student_position: req.body.student_position,
            student_intdate: req.body.student_intdate,
            student_time: req.body.student_time,
            student_resume: req.body.student_resume,
            date_time: req.body.date_time,
            status: req.body.status,
            technologies: req.body.technologies
        });

        res.json({ success: true, status: status.OK, msg: 'Candidate details updated successfully.', thirdPartyResponse: thirdPartyResponse.data });
    } catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err.response ? err.response.data : err.message, msg: 'Update Candidate details failed.' });
    }
};
