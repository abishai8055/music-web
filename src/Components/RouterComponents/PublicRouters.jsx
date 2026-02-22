import React, { useContext, useEffect } from 'react'
import { contextAPI } from '../Context'
import { useNavigate } from 'react-router-dom';

const PublicRouters = (props) => {

    let { authUserData } = useContext(contextAPI)
    let navigate = useNavigate()

    useEffect(() => {
        if (authUserData !== null && window.localStorage.getItem('TOKEN')) {
            navigate('/')
        }
    }, [authUserData, navigate])

    if(authUserData === null && !window.localStorage.getItem('TOKEN')){
        return <> {props.children} </>
    }
    
    return null
}

export default PublicRouters