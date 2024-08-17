import React from 'react';
import Nav from '../../navComponent/Nav';
import Footer from '../../FooterModule/Footer';

const AboutHome = () => {
    return (
        <>
            <div>
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerUser'>About</h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <img src="https://beehivesoftware.in/wp-content/uploads/2023/07/admin-1.jpg" alt="Your Image" style={{
                        width: '50%', height: 'auto', border: '1px solid skyblue',
                        marginLeft: '10px'
                    }} />
                    <div style={{ width: '48%', paddingLeft: '20px' }}>
                        <div style={{ color: 'black' }}>
                            <h1  style={{textAlign:'center'}}>About</h1>
                        </div>
                        <b>  Human Resource Management </b>(HRM) is the term used to describe formal systems devised for the management of people within an organization. The responsibilities of a human resource manager fall into three major areas: staffing, employee compensation and benefits, and defining/designing work.

                        A Human Resources Management System (HRMS) is a software application that combines many human resources functions, including benefits administration, payroll, recruiting and training, and performance analysis and review into one package.

                        Human Resource Management Systems provides a means of acquiring, storing, analyzing and distributing information to various stakeholders be it government, employee and to an extent to the citizen.

                        An HRMS (Human Resource Management System) is considered a basic necessity in most of private/corporate and government organizations.<br />

                        Delve into the specific functionalities and responsibilities endowed upon an administrator within the HRMS framework. Emphasize the central role admins play in configuring the system according to organizational needs, managing user roles and permissions, overseeing data security, and ensuring the smooth operation of all HR processes. Point out the tools available for administrators for reporting, analytics, and monitoring system health.
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AboutHome;