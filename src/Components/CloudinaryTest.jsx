import React, { useState } from 'react'

// Standalone Cloudinary Upload Test Component
// Use this to test if Cloudinary is configured correctly
const CloudinaryTest = () => {
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    const testUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setLoading(true)
        setResult('⏳ Uploading...')

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

        console.log('📤 Testing upload with:')
        console.log('- File:', file.name)
        console.log('- Type:', file.type)
        console.log('- Size:', (file.size / 1024).toFixed(2) + 'KB')
        console.log('- Preset:', uploadPreset)
        console.log('- Cloud:', cloudName)

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData
                }
            )

            console.log('📡 Response status:', response.status)

            const data = await response.json()
            console.log('📦 Response data:', data)

            if (data.error) {
                setResult(`❌ Error: ${JSON.stringify(data.error, null, 2)}`)
            } else if (data.secure_url) {
                setResult(`✅ Success!\n\nURL: ${data.secure_url}`)
            } else {
                setResult(`⚠️ Unexpected response: ${JSON.stringify(data, null, 2)}`)
            }
        } catch (error) {
            console.error('❌ Upload failed:', error)
            setResult(`❌ Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>🧪 Cloudinary Upload Test</h2>
            <p>Cloud Name: <strong>{import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}</strong></p>
            <p>Upload Preset: <strong>{import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}</strong></p>
            
            <input 
                type="file" 
                accept="image/*" 
                onChange={testUpload}
                disabled={loading}
                style={{ marginTop: '20px' }}
            />
            
            {result && (
                <pre style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    background: '#f5f5f5', 
                    borderRadius: '5px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                }}>
                    {result}
                </pre>
            )}

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p><strong>Check browser console (F12) for detailed logs</strong></p>
                <p>Common errors:</p>
                <ul>
                    <li>❌ "Invalid upload preset" → Preset doesn't exist or is not unsigned</li>
                    <li>❌ "Upload preset must be whitelisted" → Preset is in signed mode</li>
                    <li>❌ 401 Unauthorized → Wrong cloud name or preset</li>
                </ul>
            </div>
        </div>
    )
}

export default CloudinaryTest
