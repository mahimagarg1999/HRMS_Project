// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, skillsId }) => {
    const [errors, setErrors] = useState({});

    const [data, setData] = useState([])
    const [resume, setResume] = useState('');
    const [message, setMessage] = useState('');
    const [availableProfile, setAvailableProfile] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState([]);
    const [profiles, setProfiles] = useState([]);
    // const [profileMap, setProfileMap] = useState({});

    // useEffect(() => {
    //     if (isOpen) {
    //         setMessage('')
    //         setResume('')
    //          console.log('model open', skillsId)
    //         // Fetch data for the given skillsId
    //         if (skillsId) {
    //             const fetchData = async () => {
    //                 try {

    //                     const response = await axios.get(`${BASE_API_URL}skills/get?skillid=${skillsId}`);
    //                     const skilldata = response.data.data
    //                     setData(skilldata)
    //                     setSelectedProfile(skilldata.profile || []);
    //                     setAvailableProfile(availableProfile.filter(profile => !skilldata.profile.includes(profile)));
    //                     console.log('data', data)

    //                 } catch (error) {
    //                     console.log('model open error')

    //                     console.error('Error fetching Skills data:', error);
    //                 }
    //             };

    //             fetchData();
    //         } else {
    //             // Reset data when the modal is closed or skillsId is not provided
    //             setData({});
    //             setSelectedProfile([]);
    //         }
    //     }
    // }, [isOpen, profiles]);

    useEffect(() => {
        if (isOpen ) {
            setMessage('');
            
            if (skillsId) {
                const fetchData = async () => {
                    try {
                        const response = await axios.get(`${BASE_API_URL}skills/get?skillid=${skillsId}`);
                        const skilldata = response.data.data;
                        setData(skilldata);
                        setSelectedProfile(skilldata.profile || []);
                        // setAvailableProfile(profiles.filter(profile => !skilldata.profile.includes(profile)));
                    } catch (error) {
                        console.error('Error fetching Skills data:', error);
                    }
                };

                fetchData();

            }
        }
    }, [isOpen, skillsId, profiles]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    // useEffect(() => {
    //     const fetchProfiles = async () => {
    //         try {
    //             const response = await axios.get(`${BASE_API_URL}/recruitment/get_profile`);
    //             if (response.data.success) {
    //                 const profileData = response.data.data.map(item => item.profile);
    //                 setProfiles(profileData);
    //                 setAvailableProfile(profileData.filter(profile => !selectedProfile.includes(profile)));
    //             } else {
    //                 console.error('Failed to fetch profiles:', response.data.msg);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching profiles:', error);
    //         }
    //     };

    //     fetchProfiles();
    // }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const mydata = { ...data, profile: selectedProfile, id: data._id };

        try {
            const response = await axios.put(`${BASE_API_URL}skills/edit`, mydata);
            setMessage(response.data.msg);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}profiles/list`);
                console.log("response data--->", response.data.data)
                if (response.data.success) {
                    const profiles = response.data.data;
                    const profileMap = profiles.reduce((map, item) => {
                        map[item.profile_id] = item.profile;
                        return map;
                    }, {});
                    // setProfileMap(profileMap);
                    setAvailableProfile(profiles);

                }
            } catch (error) {
                console.error("Error fetching profiles:", error);
            }
        };

        fetchProfile();
    }, []);

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const response = await axios.get(`${BASE_API_URL}recruitment/get_profile`);
    //             console.log("response data--->", response.data.data)
    //             if (response.data.success) {
    //                 const profiles = response.data.data;
    //                 const profileMap = profiles.reduce((map, item) => {
    //                     map[item.profile_id] = item.profile;
    //                     return map;
    //                 }, {});
    //                 // setProfileMap(profileMap);
    //                 console.log("profileMap", profileMap)
    //                 setAvailableProfile(profiles);
    //                 console.log("profiles  bekar", profiles)

    //             }
    //         } catch (error) {
    //             console.error("Error fetching profiles:", error);
    //         }
    //     };

    //     fetchProfile();
    // }, []);

    // useEffect(() => {
    //     // Fetch profiles from API when the component mounts
    //     const fetchProfiles = async () => {
    //         try {
    //             const response = await axios.get(`${BASE_API_URL}/recruitment/get_profile`);
    //             if (response.data.success) {
    //                 setProfiles(response.data.data); // Set profiles in state
    //             } else {
    //                 console.error('Failed to fetch profiles:', response.data.msg);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching profiles:', error);
    //         }
    //     };

    //     fetchProfiles();
    // }, []);
    // const handleAddProfile = (profile) => {
    //     if (!selectedProfile.some(p => p.profile_id === profile.profile_id)) {
    //         const updatedSelectedProfile = [...selectedProfile, profile];
    //         setSelectedProfile(updatedSelectedProfile);
    //         setAvailableProfile(prev => prev.filter(p => p.profile_id !== profile.profile_id));

    //         // Only store profile names in formData
    //         setData(prev => ({
    //             ...prev,
    //             profile: updatedSelectedProfile.map(p => p.profile),
    //             profile_id: updatedSelectedProfile.map(p => p.profile_id)
    //         }));

    //         // Clear error if any profile is selected
    //         if (updatedSelectedProfile.length > 0) {
    //             setErrors(prevErrors => {
    //                 const { profile, ...rest } = prevErrors;
    //                 return rest;
    //             });
    //         }
    //     }
    // };

    // const handleRemoveProfile = (profile) => {
    //     const updatedSelectedProfile = selectedProfile.filter(p => p.profile_id !== profile.profile_id);
    //     setSelectedProfile(updatedSelectedProfile);
    //     setAvailableProfile(prev => [...prev, profile]);

    //     // Update formData to remove profile
    //     setData(prev => ({
    //         ...prev,
    //         profile: updatedSelectedProfile.map(p => p.profile),
    //         profile_id: updatedSelectedProfile.map(p => p.profile_id)
    //     }));

    //     // Set error if no profiles are left
    //     if (updatedSelectedProfile.length === 0) {
    //         setErrors(prevErrors => ({
    //             ...prevErrors,
    //             profile: "At least one profile is required"
    //         }));
    //     }
    // };
    const handleAddProfile = (profile) => {
        if (!selectedProfile.some(p => p.profile_id === profile.profile_id)) {
            const updatedSelectedProfile = [...selectedProfile, profile];
            setSelectedProfile(updatedSelectedProfile);
            setAvailableProfile(prev => prev.filter(p => p.profile_id !== profile.profile_id));

            // Only store profile names in formData
            setData(prev => ({
                ...prev,
                profile: updatedSelectedProfile.map(p => p.profile),
                profile_id: updatedSelectedProfile.map(p => p.profile_id)
            }));

            // Clear error if any profile is selected
            if (updatedSelectedProfile.length > 0) {
                setErrors(prevErrors => {
                    const { profile, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };

    const handleRemoveProfile = (profile) => {
        const updatedSelectedProfile = selectedProfile.filter(p => p.profile_id !== profile.profile_id);
        setSelectedProfile(updatedSelectedProfile);
        setAvailableProfile(prev => [...prev, profile]);

        // Update formData to remove profile
        setData(prev => ({
            ...prev,
            profile: updatedSelectedProfile.map(p => p.profile),
            profile_id: updatedSelectedProfile.map(p => p.profile_id)
        }));

        // Set error if no profiles are left
        if (updatedSelectedProfile.length === 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                profile: "At least one profile is required"
            }));
        }
    };


    // ProfileTag Component
    const ProfileTag = ({ profile, onRemove }) => (
        <div className="skill-tag">
            {profile}
            <button onClick={onRemove}>x</button>
        </div>
    );
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                overlay: {

                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                content: {
                    width: '100%',
                    height: '100%',
                    margin: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    border: 'none',

                }
            }}
        >

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">

                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <CloseButton onClick={onRequestClose} />

                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.skills} profile</h4>

                            </div>
                            <div class="row">
                                <div className="mb-3 col-md-6">
                                    <label><b>Skills*</b></label>
                                    <select
                                        name="skills"
                                        value={data.skills}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Skills</option>
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="React">React</option>
                                        <option value="Node.js">Node.js</option>
                                        <option value="Python">Python</option>
                                        <option value="HTML">HTML</option>
                                        <option value="CSS">CSS</option>
                                        <option value="MySQL">MySQL</option>
                                        <option value="MongoDB">MongoDB</option>
                                        <option value="Php">Php</option>
                                        <option value="Java">Java</option>
                                        <option value="Angular">Angular</option>
                                        <option value="Wordpress">Wordpress</option>
                                        <option value="Drupal">Drupal</option>
                                        <option value="Laravel">Laravel</option>
                                        <option value="IOS">IOS</option>
                                        <option value="Android">Android</option>
                                        <option value="Apache">Apache</option>
                                        <option value="Magento">Magento</option>
                                        <option value="WAMP">WAMP</option>
                                        <option value="Code Igniter">Code Igniter</option>
                                        <option value="Jquery">Jquery</option>
                                        <option value="XAMPP">XAMPP</option>
                                    </select>
                                </div>
                             
                                <div className="mb-3 col-md-6">
                                    <label><b>Profile</b></label>
                                    <div className="skills-container">
                                        <div className="available-skills">
                                            <select className="form-control" multiple size="4">
                                                {availableProfile.map(profile => (
                                                    <option
                                                        key={profile.profile_id}
                                                        value={profile.profile_id}
                                                        onClick={() => handleAddProfile(profile)}
                                                    >
                                                        {profile.profile}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="selected-skills">
                                            <label>Selected Profile</label>
                                            <div>
                                                {selectedProfile.map(profile => (
                                                    <ProfileTag
                                                        key={profile.profile_id}
                                                        profile={profile.profile}
                                                        onRemove={() => handleRemoveProfile(profile)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {errors.profile && <span className="error" style={{ color: 'red' }}>{errors.profile}</span>}
                                </div>


                                <div class="mb-3 col-md-6">
                                    <label><b>Description</b></label>
                                    <input type="text" name="description" value={data.description} onChange={handleInputChange} class="form-control" placeholder="Description" />
                                </div>
                            </div>

                            <div class="col-md-12">
                                <button type="submit">Edit here</button>
                            </div>
                            <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                        </form>


                    </div>
                </div>
            </div>
        </Modal>
    );
};


export default ModalBox;