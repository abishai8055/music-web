import { onAuthStateChanged, signOut } from 'firebase/auth'
import React, { createContext, useEffect, useState } from 'react'
import { __AUTH, __DB } from '../Backend/Firebase'
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore'
import toast from 'react-hot-toast'

export let contextAPI = createContext()

const Context = (props) => {
    // ? why : we are creating this state for storing the userInfo provided by the onAuthStateChange methods.
    let [authUserData, setAuthUserData] = useState(null)
    console.log(authUserData)

    let [allAlbums, setAllAlbums] = useState([])
    console.log("this is the all albums data : " , allAlbums)

    let [albumSongs, setAlbumSongs] = useState([])
    let [selectedSong, setSelectedSong] = useState(null)
    
    // Cloudinary upload - NO COMPRESSION
    // Uploads original files without any modification
    let uploadOnCloudinary = async (e) => {
        let file = e.target.files[0]
        if (!file) {
            throw new Error('No file selected')
        }
        
        console.log('📤 Starting upload:', file.name, 'Type:', file.type, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB')
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            throw new Error('File size exceeds 10MB limit')
        }
        
        let formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
        
        // Determine resource type based on file
        const isAudio = file.type.startsWith('audio/')
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        const uploadUrl = isAudio 
            ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
            : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        
        console.log('🌐 Upload URL:', uploadUrl)
        
        try {
            let cloudinaryResponse = await fetch(uploadUrl, {
                method: "POST",
                body: formData
            })
            
            console.log('📡 Response status:', cloudinaryResponse.status)
            
            let cloudinaryData = await cloudinaryResponse.json()
            console.log('📦 Response data:', cloudinaryData)
            
            if (cloudinaryData.error) {
                console.error('❌ Cloudinary error:', cloudinaryData.error)
                throw new Error(cloudinaryData.error.message || 'Cloudinary upload failed')
            }
            
            if (!cloudinaryData.secure_url) {
                console.error('❌ No secure_url in response')
                throw new Error('No URL returned from Cloudinary')
            }
            
            console.log('✅ Upload successful:', cloudinaryData.secure_url)
            return cloudinaryData.secure_url
        } catch (error) {
            console.error('❌ Upload error:', error.message)
            throw error
        }
    }

    let uid = authUserData?.uid || ""  //! because initial value of the authUserData is null  , this is the safe fallback

    let [authProfileData, setAuthProfileData] = useState(null)
    let [userRole, setUserRole] = useState('user') // Default role
    console.log("profileData", authProfileData)
    console.log("userRole", userRole)
    
    // Check admin status immediately when authUserData changes
    useEffect(() => {
        if (authUserData?.email === 'abishaisingh1@gmail.com') {
            setUserRole('admin')
        } else {
            setUserRole('user')
        }
    }, [authUserData])
    
    let fetchProfileData = () => {
        return (
            onSnapshot(
                // ! 1st argument
                doc(__DB, "user_Profile", uid),
                // ! 2nd argument4e
                data => {
                    const profileData = data.data()
                    setAuthProfileData(profileData)
                }
            )
        )
    }
    useEffect(() => {
        if (!uid) return;
        fetchProfileData()
    }, [uid])



    let handleLogOut = (e) => {
        signOut(__AUTH)
        console.log("logout")
        toast.success("logged Out Successfully")
    }


    // ! data from the db ❌ : updated data ❌ : real time updated data ✅
    let getUpdatedData = onAuthStateChanged(__AUTH, (userInfo) => {
        if (userInfo) {
            setAuthUserData(userInfo)
            window.localStorage.setItem('TOKEN', userInfo.accessToken)
        } else {
            setAuthUserData(null)
            window.localStorage.removeItem('TOKEN')
        }
    })
    useEffect(() => {
        return () => getUpdatedData()
    }, [])


    let fetchAllAlbums = async () => {
        const albumCollections = collection(__DB, 'albumData')
        const getAlbumDocs = await getDocs(albumCollections)
        const payload = getAlbumDocs.docs.map(
            album => {
                return { ...album.data(), id: album.id }
            }
        )
        setAllAlbums(payload)
    }

    useEffect(()=>{
        fetchAllAlbums()
    } , [])
    return (
        <contextAPI.Provider value={{ authUserData, handleLogOut, authProfileData, albumSongs, setAlbumSongs, uploadOnCloudinary, allAlbums, selectedSong, setSelectedSong, userRole, fetchAllAlbums }}>
            {props.children}
        </contextAPI.Provider>
    )
}

export default Context