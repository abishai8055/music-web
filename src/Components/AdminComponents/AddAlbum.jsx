import React, { useContext, useState } from 'react'
import { contextAPI } from '../Context'
import { __DB } from '../../Backend/Firebase'
import { addDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { collection } from 'firebase/firestore'

const AddAlbum = () => {
    let initialAlbumData = {
        albumName : '',
        albumLanguage : '',
        albumType : '',
        albumImage : '',
        albumReleaseDate : '' ,
        albumDescription : '',
        artistName : ''
    }

    let [ albumData , setAlbumData] = useState(initialAlbumData)
    let {albumName , albumLanguage , albumType , albumImage, albumReleaseDate , albumDescription , artistName} = albumData
    let [isUploading, setIsUploading] = useState(false)

    let { uploadOnCloudinary, albumSongs, setAlbumSongs, authUserData } = useContext(contextAPI)
    

    let handleChange = async (e) => {
        let {name, value, type} = e.target
        if (type === "file"){
            if (!e.target.files[0]) return
            
            setIsUploading(true)
            toast("Uploading...", {icon : '⏳'})
            try {
                const uploadedFileURL = await uploadOnCloudinary(e)
                if (uploadedFileURL) {
                    setAlbumData(prevData => ({...prevData, [name]: uploadedFileURL}))
                    toast.success("Image uploaded successfully!")
                    console.log('Uploaded URL:', uploadedFileURL)
                } else {
                    toast.error('Upload failed. Please try again.')
                }
            } catch (error) {
                console.error('Upload error:', error)
                toast.error('Upload failed. Please try again.')
            } finally {
                setIsUploading(false)
            }
        }else{
            setAlbumData(prevData => ({...prevData, [name]: value}))
        }
    }


    let handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!authUserData) {
            toast.error('Please login to add albums')
            return
        }
        
        if (isUploading) {
            toast.error('Please wait for image upload to complete')
            return
        }
        
        if (!albumName || !albumLanguage || !albumType || !artistName) {
            toast.error('Please fill all required fields')
            return
        }
        
        if (!albumImage) {
            toast.error('Please upload an album cover image')
            return
        }
        
        if (albumSongs.length === 0) {
            toast.error('Please add at least one song before saving album')
            return
        }
        
        try {
            let payload = { 
                albumName,
                albumLanguage,
                albumType,
                albumImage,
                albumReleaseDate: albumReleaseDate || new Date().toISOString().split('T')[0],
                albumDescription: albumDescription || '',
                artistName,
                allSongsData: [...albumSongs]
            }
            
            let albumCollection = collection(__DB, "albumData")
            await addDoc(albumCollection, payload)
            setAlbumData(initialAlbumData)
            setAlbumSongs([])
            toast.success("Album created successfully")
        } catch (error) {
            console.error("Error occurred:", error)
            toast.error(error?.message || "Failed to create album")
        }
    }
  return (
    <section className='w-[90%] p-10 rounded-2xl' style={{ background: '#15151D', border: '1px solid rgba(122, 16, 35, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)' }}>
        <h2 className='text-3xl font-bold mb-2 gradient-burgundy'>Add Album Details</h2>
        <p className='text-sm mb-4' style={{ color: '#B3B3B3' }}>Complete album information (Step 2)</p>
        <p className='text-sm mb-6 font-medium' style={{ color: '#E63946' }}>Songs in album: {albumSongs.length}</p>

        <form onSubmit={handleSubmit} className='w-full grid grid-cols-3 gap-x-12 gap-y-8 mt-8'>

            {/* albumName */}
            <article className='flex flex-col gap-2'>
                <label htmlFor='albumName' className='text-sm font-medium' style={{ color: '#B3B3B3' }}>Album Name</label>
                <input name = 'albumName' value={albumName} id = 'albumName' onChange={handleChange} className='rounded-xl outline-0 px-4 py-2.5 input-focus' style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(122, 16, 35, 0.3)', color: '#FFFFFF' }} placeholder='Enter album name' required />
            </article>

            {/* albumLanguage */}
            <article className='flex flex-col gap-2'>
                <label htmlFor='albumLanguage' className='text-sm font-medium' style={{ color: '#B3B3B3' }}>Album Language</label>
                <input name = 'albumLanguage' value={albumLanguage} id = 'albumLanguage' onChange={handleChange} className='rounded-xl outline-0 px-4 py-2.5 input-focus' style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(122, 16, 35, 0.3)', color: '#FFFFFF' }} placeholder='e.g., English' required />
            </article>

            
            {/* albumType */}
            <article className='flex flex-col gap-2'>
                <label htmlFor='albumType' className='text-sm font-medium' style={{ color: '#B3B3B3' }}>Album Type</label>
                <input name = 'albumType' value={albumType} id = 'albumType' onChange={handleChange} className='rounded-xl outline-0 px-4 py-2.5 input-focus' style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(122, 16, 35, 0.3)', color: '#FFFFFF' }} placeholder='e.g., Pop, Rock' required />
            </article>

            {/* albumImage */}
            <article className='flex flex-col gap-2'>
                <label htmlFor='albumImage' className='text-sm font-medium text-gray-300'>
                    Album Cover Image {albumImage && <span className='text-accent'>✓ Uploaded</span>}
                </label>
                <input 
                    type='file' 
                    name='albumImage' 
                    accept='image/*' 
                    id='albumImage' 
                    onChange={handleChange} 
                    className='bg-secondary/50 border border-burgundy/30 rounded-xl outline-0 px-4 py-2.5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer hover:file:bg-accent-hover' 
                />
                {albumImage && (
                    <img src={albumImage} alt='Preview' className='w-20 h-20 object-cover rounded-lg mt-2' />
                )}
            </article>

            {/* albumReleaseDate */}
            <article className='flex flex-col gap-2'>
                <label htmlFor='albumReleaseDate' className='text-sm font-medium text-gray-300'>Release Date</label>
                <input type='date' name = 'albumReleaseDate' value={albumReleaseDate} id = 'albumReleaseDate' onChange={handleChange} className='bg-secondary/50 border border-burgundy/30 rounded-xl outline-0 px-4 py-2.5 text-white input-focus' />
            </article>
            
            {/* artistName */}
            <article className='flex flex-col gap-2'>
                <label htmlFor='artistName' className='text-sm font-medium text-gray-300'>Artist Name</label>
                <input name = 'artistName' value={artistName} id = 'artistName' onChange={handleChange} className='bg-secondary/50 border border-burgundy/30 rounded-xl outline-0 px-4 py-2.5 text-white input-focus' placeholder='Enter artist name' required />
            </article>

            {/* albumDescription */}
            <article className='flex flex-col col-span-2 gap-2'>
                <label htmlFor='albumDescription' className='text-sm font-medium text-gray-300'>Album Description</label>
                <input name = 'albumDescription' value={albumDescription} id = 'albumDescription' onChange={handleChange} className='bg-secondary/50 border border-burgundy/30 rounded-xl outline-0 px-4 py-2.5 text-white input-focus' placeholder='Short description (optional)' />
            </article>

            <article className='flex items-end'>
                <button 
                    type='submit' 
                    disabled={isUploading}
                    className='w-full btn-burgundy py-2.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isUploading ? 'Uploading...' : 'Save Album'}
                </button>
            </article>
        </form>
    </section>
  )
}

export default AddAlbum