import React, { useEffect } from 'react';
import { useTheme } from "../contexts/themeContext";
import { Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const Contact = () => {
    // Get the current theme from the context
    const { theme } = useTheme();

    // Set the form ID and URL based on the theme
    const formId = theme === 'dark' ? "form-contact-ji8k1n" : "form-contact-faex9d";
    const formUrl = theme === 'dark' ? "https://opnform.com/forms/contact-ji8k1n" : "https://opnform.com/forms/contact-faex9d";

    useEffect(() => {
        // Create a new script element
        const script = document.createElement('script');
    
        // Set the source of the script to the iframeResize script
        script.src = 'https://opnform.com/widgets/iframeResize.min.js';
    
        // Make the script load asynchronously
        script.async = true;
    
        // Add the script to the body of the document
        document.body.appendChild(script);
    
        // Set a timeout to run the iFrameResize function after 1 second
        const timeoutId = setTimeout(() => {
            // Check if the iFrameResize function is available
            // @ts-ignore is used to ignore TypeScript errors about iFrameResize not being defined
            if (window.iFrameResize) {
                // Call the iFrameResize function with the form ID
                // @ts-ignore
                window.iFrameResize({log: false, checkOrigin: false}, `#${formId}`);
            }
        }, 1000);
    
        // Return a cleanup function to remove the script and clear the timeout when the component unmounts or the theme changes
        return () => {
            document.body.removeChild(script);
            clearTimeout(timeoutId);
        };
    }, [theme]) // Run the effect when the component mounts and whenever the theme changes

    

    // Render an iframe with the form ID and URL
    return (
        <div style={{position: 'relative', height: '100vh', width: '100%', backgroundColor: theme === 'dark' ? "#191919" : "white"}}>
                <Link to="/shop">
                    <Button style={{marginTop: '150px', marginLeft:'50px'}} className="m-4">Back to Shop</Button>
                </Link>
            <iframe style={{border: "none", width: "100%", backgroundColor: "transparent"}} id={formId} src={formUrl}></iframe>
        </div>
    );
};

export default Contact;