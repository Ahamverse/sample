// ==================================================
// Project Imports
// ==================================================

// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';

// ==================================================
// General Notes for Rosie AI
// ==================================================

// Note: In sandboxed environments, avoid using <form> elements and traditional
// form submissions as they may be blocked by security policies. Instead, use
// controlled components with direct event handlers (onClick, onChange, etc.).

// ==================================================
// ChatAIClass Definition
// ==================================================

// This module provides a class, ChatAIClass, which uses a ChatManager (provided externally) 
// to conduct a conversation with an AI. The AI's behavior is defined by a description string, 
// and the ChatAIClass offers a simple getResponse method to get AI responses.
// 
// This is AI is powered by Rosebud AI and is Rosebud's method to add in-game AI features.
//
// IMPORTANT NOTE:
// - Do not assume how ChatManager works beyond what is described here.
// - We only know that:
//   1. ChatManager is constructed by passing in a description string.
//   2. We can add messages by calling chatManager.addMessage('user', prompt).
//   3. We can get an AI-generated response by calling chatManager.getCharacterResponse('classify').
// - Any other assumptions about ChatManager internals or methods should not be made.
//
// This code can be used in any JS project by simply importing this class and using it.
//////////////////////////////////////////////////////////////

// Defines how the AI should behave. This should change to match the project. 
const AI_BEHAVIOR_DESCRIPTION = `
You are an advanced and knowledgeable AI system capable of assisting users with 
a wide range of topics. You should respond concisely and helpfully, ensuring that 
the information you provide is accurate, clear, and context-aware.
`;

/**
 * ChatAIClass:
 * 
 * This class is intended for non-technical users who want to interact with an AI system.
 * 
 * Usage:
 * 1. Create an instance of ChatAIClass:
 *    const chat = new ChatAIClass();
 * 
 * 2. Call getResponse(prompt) to get a response from the AI:
 *    const answer = await chat.getResponse("What is quantum computing?");
 *    console.log(answer);
 */

export class ChatAIClass {
    constructor() {
        // Directly create a new ChatManager instance with the AI behavior description.
        // We assume ChatManager is available globally or imported from elsewhere.
        this.chatManager = new ChatManager(AI_BEHAVIOR_DESCRIPTION);
    }

    /**
     * Generates a response from the AI based on the given prompt.
     *
     * @param {string} prompt - The user's input or question.
     * @returns {Promise<string>} - The AI's response as text.
     */
    async getResponse(prompt) {
        // Add the user's message to the conversation.
        this.chatManager.addMessage('user', prompt);

        // Ask the ChatManager for the AI's response and return it.
        const response = await this.chatManager.getCharacterResponse('classify');

        // Add the AI's message to the conversation so it has memory of it.
        this.chatManager.addMessage('assistant', response);

        return response;
    }
}

// ==================================================
// Main App Component with Three.js Scene
// ==================================================

const App = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Handle window resizing
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);
      
      // Update camera position to maintain cube visibility
      camera.position.z = 5;
    };
    
    // Initial setup
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    handleResize(); // Call once to set initial dimensions
    window.addEventListener('resize', handleResize);
    
    // Create cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ffffff',
    }}>
      <div ref={mountRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
      }}>
        <h1>Hello World</h1>
      </div>
    </div>
  );
};
const container = document.getElementById('renderDiv');
const root = ReactDOM.createRoot(container);
root.render(<App />);
