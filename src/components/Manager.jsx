import React, { useEffect, useState, useRef } from 'react'
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);

    useEffect(() => {
        let passwords = localStorage.getItem("passwords");
        console.log(passwords);

        // ?CHECKING IF PASSWORDS EXISTS IN LOCALSTORAGE
        if (passwords) {
            // ?CONVERTING STRING TO ARRAY IF EXIST
            setPasswordArray(JSON.parse(passwords));
        }
    }, [])


    const showPassword = () => {
        console.log(ref.current.src);
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png";
            passwordRef.current.type = "password";
        } else {
            ref.current.src = "icons/eyecross.png";
            passwordRef.current.type = "text";
        }
    }

    const savePassword = () => {
        const nSite = form.site.trim();
        const nUsername = form.username.trim();
        const nPassword = form.password.trim();
        if (nSite.length >= 3 && nUsername.length >= 3 && nPassword.length >= 3) {
            const newPass = { site: nSite, username: nUsername, password: nPassword, id: uuidv4() };

            // ?SPREADING THE PASSWORDARRAY AND PUSHING THE NEW PASSWORD FROM FORM
            setPasswordArray([...passwordArray, newPass]);
            setform({ site: "", username: "", password: "" });

            // ?UPDATING THE LOCALSTORAGE
            // *WRITING [...passwordArray, form] INSTEAD OF JUST passwordArray SINCE IT TAKES TIME TO SET THE STATE
            localStorage.setItem("passwords", JSON.stringify([...passwordArray, newPass]));
            toast.success('Password Saved!!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
                transition: Flip
            });
        }
        else {
            let warningMessage = "";
            if (nSite.length < 3) {
                warningMessage = "URL entered is too short";
            } else if (nUsername.length < 3) {
                warningMessage = "Name should be at least 3 characters";
            } else if (nPassword.length < 3) {
                warningMessage = "Password should be at least 3 characters";
            }

            if (warningMessage) {
                toast.warning(warningMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                    transition: Flip
                });
            }
        }

    }

    const editPassword = (id) => {
        console.log(`Editing Password with id ${id}`);

        // ?SINCE IT'S AN ARRAY OF OBJECTS, NEED TO WRITE [0]
        setform(passwordArray.filter(item => item.id === id)[0]);

        // ?ON EDITING THE PASSWORD A DUPLICATE IS NOT GENERATED
        setPasswordArray(passwordArray.filter(item => item.id !== id));
    }

    const deletePassword = (id) => {
        console.log(`Deleting Password with id ${id}`);
        let checkConfirm = confirm("Are you sure you want to delete this password?");

        if (checkConfirm) {
            // ?THIS WILL FILTER OUT THE PASSWORDS WHICH WERE NOT SELECTED AND SHOW THEM IN TABLE
            setPasswordArray(passwordArray.filter(item => item.id !== id));
            localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)));
            toast.error('Password Deleted!!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
                transition: Flip
            });
        }
    }


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    }

    const copyText = (text) => {
        toast.success('Copied to Clipboard!!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            transition: Flip
        });
        navigator.clipboard.writeText(text);
    }

    return (
        <>
            <ToastContainer
                pauseOnFocusLoss={false}
            />

            <div className="absolute inset-0 -z-10 h-full w-full"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

            <div className="md:p-2 md:mycontainer min-h-[calc(100vh-120px)]">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>
                    <span>Pass</span>
                    <span className='text-green-500'>Keeper&nbsp;/ &gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your Own Password Manager</p>

                <div className='flex flex-col p-4 text-black gap-8 items-center'>

                    <input placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full p-4 py-1' value={form.site} onChange={handleChange} type="text" name="site" />

                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">

                        <input placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' value={form.username} onChange={handleChange} type="text" name="username" />

                        <div className="relative w-full">

                            <input ref={passwordRef} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" value={form.password} onChange={handleChange} name="password" />

                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>

                                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>

                    <button className='flex justify-center items-center gap-2 bg-green-300 hover:bg-green-400 rounded-full px-8 py-2 w-fit border border-green-900' onClick={savePassword}>

                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save
                    </button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>

                    {/* IF PASSWORDS ARE NOT PRESENT */}
                    {passwordArray.length == 0 && <div>No Passwords to Show</div>}

                    {/* IF PASSWORD IS PRESENT */}
                    {passwordArray.length != 0 &&
                        // ?TO GIVE BORDER RADIUS IN TABLE NEED TO PUT overflow-hidden
                        <table className="table-fixed w-full rounded-md overflow-hidden mb-10">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>

                            <tbody className='bg-green-100'>
                                {
                                    passwordArray.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='py-2 border border-white text-center'>
                                                    <div className='flex items-center justify-center '>
                                                        <a className='overflow-hidden whitespace-nowrap text-ellipsis p-1' href={item.site} target="_blank">
                                                            <span>{item.site}</span>
                                                        </a>
                                                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                                                            <lord-icon
                                                                style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                                                trigger="hover">
                                                            </lord-icon>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className='py-2 border border-white text-center'>
                                                    <div className='flex items-center justify-center '>
                                                        <span className='overflow-hidden whitespace-nowrap text-ellipsis p-1'>{item.username}</span>
                                                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                            <lord-icon
                                                                style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                                                trigger="hover">
                                                            </lord-icon>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className='py-2 border border-white text-center'>
                                                    <div className='flex items-center justify-center '>
                                                        <span className='overflow-hidden whitespace-nowrap text-ellipsis p-1'>{item.password}</span>
                                                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                            <lord-icon
                                                                style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                                                trigger="hover">
                                                            </lord-icon>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className='py-2 border border-white text-center'>
                                                    <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/gwlusjdu.json"
                                                            trigger="hover"
                                                            style={{ "width": "25px", "height": "25px" }}>
                                                        </lord-icon>
                                                    </span>

                                                    <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/skkahier.json"
                                                            trigger="hover"
                                                            style={{ "width": "25px", "height": "25px" }}>
                                                        </lord-icon>
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    }
                </div>
            </div >
        </>
    )
}

export default Manager