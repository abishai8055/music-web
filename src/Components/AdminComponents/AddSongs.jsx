import React, { useContext, useState } from 'react'
import { contextAPI } from '../Context'
import toast from 'react-hot-toast'
import { FiTrash2, FiMusic } from 'react-icons/fi'

const AddSongs = () => {
    let initialSongData = {
        songName : '',
        songUrl : '',
        songSingers : '',
        songImage : '',
        songMusicDirector : ''
    }

    let [song, setSong] = useState(initialSongData)
    let {songName, songSingers , songMusicDirector, songImage, songUrl} = song
    let [isImageUploaded, setIsImageUploaded] = useState(false)
    let [isAudioUploaded, setIsAudioUploaded] = useState(false)
    let [isUploading, setIsUploading] = useState(false)

    let { albumSongs, setAlbumSongs, uploadOnCloudinary} = useContext(contextAPI)

    let handleChange = async (e) => {
        let {name, value, type} = e.target
        if (type === "file"){
            if (!e.target.files[0]) return
            
            const file = e.target.files[0]
            
            if (name === 'songUrl') {
                const maxSize = 10 * 1024 * 1024
                if (file.size > maxSize) {
                    toast.error('Audio file must be less than 10MB')
                    e.target.value = ''
                    return
                }
            }
            
            setIsUploading(true)
            
            try {
                toast('Uploading...', {icon : '⏳'})
                const uploadedFileURL = await uploadOnCloudinary(e)
                if (uploadedFileURL) {
                    setSong({...song, [name] : uploadedFileURL})
                    if (name === 'songImage') {
                        setIsImageUploaded(true)
                        toast.success('Image uploaded successfully')
                    } else if (name === 'songUrl') {
                        setIsAudioUploaded(true)
                        toast.success('Audio uploaded successfully')
                    }
                } else {
                    toast.error('Upload failed. Please try again.')
                }
            } catch (error) {
                console.error('Upload error:', error)
                toast.error(error.message || 'Upload failed. Please try again.')
                e.target.value = ''
            } finally {
                setIsUploading(false)
            }
        }else{
            setSong({...song, [name]:value})
        }
    }

    let handleAddSong = (e) => {
        e.preventDefault()
        
        if (!songName || !songSingers || !songMusicDirector) {
            toast.error('Please fill all required fields')
            return
        }
        
        if (!isImageUploaded || !isAudioUploaded) {
            toast.error('Please upload both image and audio files')
            return
        }
        
        setAlbumSongs([...albumSongs, song])
        setSong(initialSongData)
        setIsImageUploaded(false)
        setIsAudioUploaded(false)
        toast.success('Song added to album list')
    }
    
    let handleRemoveSong = (index) => {
        setAlbumSongs(albumSongs.filter((_, i) => i !== index))
        toast.success('Song removed from list')
    } 
    return (
        <section className='w-[90%] p-10 rounded-2xl' style={{ background: '#15151D', border: '1px solid rgba(122, 16, 35, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)' }}>
        <h2 className='text-3xl font-bold mb-2 gradient-burgundy'>Add Songs to Album</h2>
        <p className='text-sm mb-6' style={{ color: '#B3B3B3' }}>Upload songs with cover images (Step 1)</p>

        <form onSubmit={handleAddSong} className='w-full grid grid-cols-3 gap-x-12 gap-y-8 mt-8'>
            <article className='flex flex-col gap-2'>
                <label htmlFor='songName' className='text-sm font-medium' style={{ color: '#B3B3B3' }}>Song Name</label>
                <input name = 'songName' value={songName} id = 'songName' onChange={handleChange} className='rounded-xl outline-0 px-4 py-2.5 input-focus' style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(122, 16, 35, 0.3)', color: '#FFFFFF' }} placeholder='Enter song name' />
            </article>

            <article className='flex flex-col gap-2'>
                <label htmlFor='songSingers' className='text-sm font-medium' style={{ color: '#B3B3B3' }}>Song Singers</label>
                <input name = 'songSingers' value={songSingers} id = 'songSingers' onChange={handleChange} className='rounded-xl outline-0 px-4 py-2.5 input-focus' style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(122, 16, 35, 0.3)', color: '#FFFFFF' }} placeholder='Enter artist name' />
            </article>

            <article className='flex flex-col gap-2'>
                <label htmlFor='songMusicDirector' className='text-sm font-medium' style={{ color: '#B3B3B3' }}>Music Director</label>
                <input name = 'songMusicDirector' value={songMusicDirector} id = 'songMusicDirector' onChange={handleChange} className='rounded-xl outline-0 px-4 py-2.5 input-focus' style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(122, 16, 35, 0.3)', color: '#FFFFFF' }} placeholder='Enter composer name' />
            </article>

            <article className='flex flex-col gap-2'>
                <label htmlFor='songImage' className='text-sm font-medium' style={{ color: '#B3B3B3' }}>
                    Song Cover Image {isImageUploaded && <span className='text-accent'>✓ Uploaded</span>}
                </label>
                <input type = 'file' name = 'songImage' accept='image/*' id = 'songImage' onChange={handleChange} className='rounded-xl outline-0 px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:cursor-pointer' style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(122, 16, 35, 0.3)', color: '#FFFFFF' }} />
                {songImage && (
                    <img src={songImage} alt='Preview' className='w-16 h-16 object-cover rounded-lg mt-2' />
                )}
            </article>

            <article className='flex flex-col gap-2'>
                <label htmlFor='songUrl' className='text-sm font-medium' style={{ color: '#B3B3B3' }}>
                    Song Audio File (Max 10MB) {isAudioUploaded && <span className='text-accent'>✓ Uploaded</span>}
                </label>
                <input 
                    type='file' 
                    name='songUrl' 
                    accept='audio/*' 
                    id='songUrl' 
                    onChange={handleChange}
                    disabled={isUploading}
                    className='rounded-xl outline-0 px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' 
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(122, 16, 35, 0.3)', color: '#FFFFFF' }} 
                />
            </article>

            <article className='flex items-end'>
                <button 
                    type='submit'
                    disabled={!isImageUploaded || !isAudioUploaded || isUploading}
                    className='w-full btn-burgundy py-2.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isUploading ? 'Uploading...' : 'Add Song to List'}
                </button>
            </article>
        </form>
        
        {albumSongs.length > 0 && (
            <div className='mt-10'>
                <h3 className='text-xl font-semibold mb-4' style={{ color: '#E63946' }}>Songs in Album ({albumSongs.length})</h3>
                <div className='grid gap-4'>
                    {albumSongs.map((s, index) => (
                        <div key={index} className='flex items-center gap-4 p-4 rounded-xl' style={{ background: 'rgba(122, 16, 35, 0.1)', border: '1px solid rgba(122, 16, 35, 0.2)' }}>
                            <img src={s.songImage} alt={s.songName} className='w-16 h-16 rounded-lg object-cover' />
                            <div className='flex-1'>
                                <p className='font-semibold' style={{ color: '#FFFFFF' }}>{s.songName}</p>
                                <p className='text-sm' style={{ color: '#B3B3B3' }}>{s.songSingers}</p>
                            </div>
                            <button 
                                onClick={() => handleRemoveSong(index)}
                                className='p-2 rounded-lg transition-all hover:bg-red-500/20'
                                style={{ color: '#E63946' }}
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
        </section>
    )
}

export default AddSongs