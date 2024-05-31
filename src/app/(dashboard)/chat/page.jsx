'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import styles from '../../ui/dashboard/chat/chat.module.css'
import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from '@google/generative-ai'

const AiChat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [chat,setChat] = useState(null);
    const [error, setError] = useState(null);

    const MODEL_NAME = 'gemini-1.0-pro-001';
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    const generationConfig={
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings =[
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    useEffect(()=>{
        const initChat = async() =>{
            try{
                const newChat = await genAI.getGenerativeModel({model: MODEL_NAME}).startChat({
                    generationConfig,
                    safetySettings,
                    history: messages.map((msg)=>({
                        text: msg.text,
                        role: msg.role,
                    })),
                });
                setChat(newChat);
            }catch(error){
                setError('Failed to initialize chat, please try again.');
            }
        };

        initChat();
    },[]);

    const handleSendMessage = async () =>{
        try{
            const userMessage = {
                text: userInput,
                role: 'user',
                timestamp: new Date(),
            };
            setMessages((prevmessages) => [...prevmessages, userMessage]);
            setUserInput("");

            if(chat){
                const result = await chat.sendMessage(userInput);
                const botMessage ={
                    text: result.response.text(),
                    role: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prevmessages)=>[...prevmessages,botMessage]);
            }
        }catch(error){
            setError("Failed to send message, please try again");
        }
    };

    const handleKeyPress = (e) =>{
        if(e.key === 'Enter'){
            e.preventDefault();
            handleSendMessage();
        }
    }

    return (
      <div>
        <div className={styles.container}>
            {messages.map((msg, index) => (
                <div key={index} className={`${styles.messageContainer} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}>
                    <span className={`${styles.messageText} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}>
                        {msg.text}
                    </span>
                    <p className={styles.messageTimestamp}>
                    {msg.role === 'bot' ? "Bot" : "You"} - {msg.timestamp.toLocaleTimeString()}
                    </p>
                    {console.log(msg.text)}
                </div>
            ))}

            {error && (
                <div className={styles.errorMessage}>
                    Error: {error}
                </div>
            )}

            <div className={styles.form}>
                <input
                    type="text"
                    placeholder='Type your message...'
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className={styles.inputBox}
                />
                <button
                    onClick={handleSendMessage}
                    className={styles.button}
                >
                    Send
                </button>
            </div>
        </div>
      </div>
    );
}

export default AiChat;
