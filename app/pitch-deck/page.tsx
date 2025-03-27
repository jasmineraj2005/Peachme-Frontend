"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import DOMPurify from "dompurify"

// Add styles for pitch deck content
const pitchDeckStyles = `
.pitch-deck-container {
  width: 100%;
  min-height: 100vh;
}

.pitch-deck-content {
  width: 100%;
  min-height: 100vh;
}

/* Ensure any charts render properly */
.pitch-deck-content svg {
  max-width: 100%;
  height: auto;
}

/* Ensure responsive images */
.pitch-deck-content img {
  max-width: 100%;
  height: auto;
}

/* Allow animations to work */
.pitch-deck-content * {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Support for icons */
.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Simulated charts */
.chart-bar {
  height: 100%;
  transition: all 0.5s ease-out;
}

.chart-pie {
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.chart-slice {
  position: absolute;
  transform-origin: 50% 50%;
}

/* Handle print styling */
@media print {
  .fixed {
    display: none !important;
  }
}
`;

export default function PitchDeckPage() {
  const router = useRouter()
  const [jsxCode, setJsxCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Call the API on component mount
  useEffect(() => {
    fetchPitchDeckJSX()
    
    // Add required React Icons styles
    const iconStyle = document.createElement('style')
    iconStyle.textContent = `
      .react-icon {
        display: inline-block;
        fill: currentColor;
        height: 1em;
        width: 1em;
        stroke-width: 0;
        stroke: currentColor;
        vertical-align: -0.125em;
      }
    `
    document.head.appendChild(iconStyle)
  }, [])
  
  const fetchPitchDeckJSX = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Get stored data from localStorage
      const storedEvaluation = localStorage.getItem('pitchEvaluation')
      const storedMarketResearch = localStorage.getItem('marketResearch')
      
      if (!storedEvaluation) {
        throw new Error("No pitch evaluation found. Please upload and analyze a pitch first.")
      }
      
      let payload: any = {}
      
      try {
        const evaluation = JSON.parse(storedEvaluation)
        payload = {
          context: evaluation.evaluation.context,
          evaluation: evaluation.evaluation
        }
      } catch (error) {
        console.error('Error parsing evaluation data:', error)
        throw new Error('Failed to parse evaluation data')
      }
      
      if (storedMarketResearch) {
        try {
          payload = {
            ...payload,
            market_research: JSON.parse(storedMarketResearch)
          }
        } catch (error) {
          console.error('Error parsing market research data:', error)
          // Continue without market research
        }
      }
      
      console.log('Sending request to API with payload:', payload)
      
      // Get API URL based on environment
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8001/api/video/pitch-deck-content'
        : 'http://0.0.0.0:8001/api/video/pitch-deck-content';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: JSON.stringify(payload)
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }
      
      // Parse the JSON response
      const data = await response.json()
      console.log('API response received:', data)
      
      if (!data.jsx_code) {
        throw new Error("No JSX code received from the API")
      }
      
      // Set the JSX code
      setJsxCode(data.jsx_code)
      
    } catch (error) {
      console.error('Error fetching pitch deck JSX:', error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Function to sanitize and prepare JSX for rendering
  const getSanitizedJSX = () => {
    if (!jsxCode) return "";
    
    // Replace React Icons imports with equivalent SVG icons
    let processedCode = jsxCode;
    
    // Include fallback SVG icon implementations where needed
    const iconSVGs: { [key: string]: string } = {
      FaChartPie: '<svg class="react-icon" viewBox="0 0 24 24"><path d="M11 3.05V11h7.95c-.5-4.27-4.18-7.7-8.48-7.95M11 13v7.95c4.27-.5 7.7-4.18 7.95-8.48H11zm2-11c-5.18 0-9.45 3.95-9.95 9H10V2zm-1 11H3.05c.5 5.05 4.77 9 9.95 9V13z"/></svg>',
      FaLightbulb: '<svg class="react-icon" viewBox="0 0 24 24"><path d="M12 2c-4.42 0-8 3.58-8 8 0 2.75 1.38 5.18 3.5 6.62V19c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-2.38C19.62 15.18 21 12.75 21 10c0-4.42-3.58-8-8-8zm0 14c-.83 0-1.5-.67-1.5-1.5S11.17 13 12 13s1.5.67 1.5 1.5S12.83 16 12 16z"/></svg>',
      FaRocket: '<svg class="react-icon" viewBox="0 0 24 24"><path d="M12.75 3.94c-4.38.42-7.7 4.18-7.7 8.62 0 1.56.45 3.03 1.22 4.26L3 21.94l1.15 1.15 5.13-5.13c1.28.82 2.78 1.3 4.38 1.3 4.46 0 8.24-3.32 8.66-7.7l-9.57-6.62zm2.83 10.42L12 11l-2.25 2.25c-.41.41-.41 1.09 0 1.5.41.41 1.09.41 1.5 0 .18-.2.26-.45.26-.7.01.25.09.5.26.7.41.41 1.09.41 1.5 0 .41-.41.41-1.09 0-1.5l-.01.01z"/></svg>',
      FaUsers: '<svg class="react-icon" viewBox="0 0 24 24"><path d="M9 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm4-9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm6 6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-8 9c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8-9c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
      FaChartLine: '<svg class="react-icon" viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z"/></svg>',
      BiTrendingUp: '<svg class="react-icon" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>',
      BiTargetLock: '<svg class="react-icon" viewBox="0 0 24 24"><path d="M12 4C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5l2 0 0 2 2 0 0-2 2 0 0-2-2 0 0-2-2 0 0 2-2 0z"/></svg>',
      BiTime: '<svg class="react-icon" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'
    };
    
    // First, let's check if we're getting just the JSX code text without proper HTML structure
    if (processedCode.includes('import { FC } from \'react\';') && !processedCode.includes('<html>')) {
      // This is the raw JSX code, not HTML. We need to extract the actual component structure
      
      // Remove the imports, exports, and function declaration, keeping only the JSX return content
      processedCode = processedCode.replace(/import[^;]*;/g, '');
      processedCode = processedCode.replace(/const PitchDeck: FC = \(\) => {/g, '');
      processedCode = processedCode.replace(/return \(/g, '');
      processedCode = processedCode.replace(/\);[\s]*\};[\s]*export default PitchDeck;/g, '');
      
      // Wrap the content in a proper div structure
      processedCode = `
        <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-8">
          <div class="max-w-6xl mx-auto">
            ${processedCode}
          </div>
        </div>
      `;
      
      // Replace JSX comments with divs to preserve structure
      processedCode = processedCode.replace(/{\/\* (.*?) \*\/}/g, '<div class="section-title text-lg font-semibold text-gray-500 mb-2">$1</div>');
      
      // Add basic styling to text elements
      const lines = processedCode.split('\n');
      const styledLines = lines.map(line => {
        // Skip lines that already have HTML tags
        if (line.trim().startsWith('<') || line.trim() === '') {
          return line;
        }
        
        // Check if this is a section title (single line followed by content)
        if (line.trim() && !line.trim().includes(':') && line.trim().split(' ').length <= 3) {
          return `<h2 class="text-3xl font-bold text-gray-800 mb-4">${line.trim()}</h2>`;
        }
        
        // Check if this is a feature title (format: "Title: Description")
        if (line.trim().includes(':')) {
          const [title, description] = line.split(':');
          return `
            <div class="mb-6">
              <h3 class="text-xl font-semibold text-gray-700">${title.trim()}</h3>
              <p class="text-gray-600">${description ? description.trim() : ''}</p>
            </div>
          `;
        }
        
        // Regular paragraph
        return `<p class="text-gray-600 mb-6">${line.trim()}</p>`;
      });
      
      processedCode = styledLines.join('\n');
      
      // Style the hero section specifically - use separate regex to avoid s flag
      let heroSectionRegex = new RegExp('<div class="section-title[^>]*>Hero Section<\\/div>\\s*<h2[^>]*>(.*?)<\\/h2>\\s*<p[^>]*>(.*?)<\\/p>');
      let heroMatches = heroSectionRegex.exec(processedCode);
      if (heroMatches && heroMatches.length >= 3) {
        processedCode = processedCode.replace(
          heroSectionRegex,
          `<div class="mb-16 p-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl text-white text-center">
           <h1 class="text-5xl font-bold mb-4">${heroMatches[1]}</h1>
           <p class="text-xl font-light max-w-2xl mx-auto">${heroMatches[2]}</p>
          </div>`
        );
      }
      
      // Add section styling
      processedCode = processedCode.replace(
        /<div class="section-title[^>]*>(.*?) Section<\/div>/g,
        (match, sectionName) => {
          // Add icons based on section type
          let icon = '';
          switch(sectionName.trim()) {
            case 'Overview':
              icon = '<svg class="inline-block w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>';
              break;
            case 'Problem':
              icon = '<svg class="inline-block w-6 h-6 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>';
              break;
            case 'Why Now':
              icon = '<svg class="inline-block w-6 h-6 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>';
              break;
            case 'Solution':
              icon = '<svg class="inline-block w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
              break;
            case 'Market':
              icon = '<svg class="inline-block w-6 h-6 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/></svg>';
              break;
            default:
              icon = '<svg class="inline-block w-6 h-6 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>';
          }
          
          return `<div class="mb-16 p-8 bg-white rounded-xl shadow-lg">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center">${icon}${sectionName}</h2>`;
        }
      );
      
      // Enhance Market section with a chart
      if (processedCode.includes('Market')) {
        // Find the market section
        const marketStart = processedCode.indexOf('<div class="section-title text-lg font-semibold text-gray-500 mb-2">Market Section</div>');
        if (marketStart !== -1) {
          // Extract market content 
          let marketSection = processedCode.substring(marketStart);
          const nextSectionStart = marketSection.indexOf('<div class="section-title', 10);
          const endDiv = marketSection.indexOf('</div></div>', 10);
          
          let marketEnd = nextSectionStart !== -1 ? nextSectionStart : endDiv;
          if (marketEnd === -1) marketEnd = marketSection.length;
          
          marketSection = marketSection.substring(0, marketEnd);
          
          // Look for market size information (numbers)
          const marketSizeMatch = marketSection.match(/\$?(\d+)\s*billion/i) || marketSection.match(/\$?(\d+)\s*million/i);
          const marketFutureMatch = marketSection.match(/\$?(\d+)\s*billion\s*(?:by|in)\s*(\d{4})/i) || 
                                    marketSection.match(/\$?(\d+)\s*million\s*(?:by|in)\s*(\d{4})/i);
          
          if (marketSizeMatch || marketFutureMatch) {
            // Create visual chart
            const currentSize = marketSizeMatch ? parseInt(marketSizeMatch[1]) : 100;
            const futureSize = marketFutureMatch ? parseInt(marketFutureMatch[1]) : currentSize * 2;
            const futureYear = marketFutureMatch ? marketFutureMatch[2] : '2030';
            const currentYear = new Date().getFullYear();
            
            // Get paragraph containing market info
            const marketParaMatch = marketSection.match(/<p[^>]*>(.*?)<\/p>/);
            if (marketParaMatch) {
              const marketChart = `
                <div class="mt-8 mb-12">
                  <div class="text-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Market Growth Projection</h3>
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Current (${currentYear})</span>
                      <span>Projected (${futureYear})</span>
                    </div>
                  </div>
                  <div class="relative h-24 bg-gray-100 rounded-lg overflow-hidden flex">
                    <div class="h-full w-${Math.min(Math.floor(currentSize / 10), 10) * 10}% bg-blue-500 relative group transition-all duration-500 ease-out">
                      <div class="absolute inset-0 flex items-center justify-center text-white font-bold">
                        $${currentSize}B
                      </div>
                      <div class="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rotate-45"></div>
                    </div>
                    <div class="h-full w-${Math.min(Math.floor((futureSize - currentSize) / 10), 10) * 10}% bg-purple-500 relative group transition-all duration-500 ease-out">
                      <div class="absolute inset-0 flex items-center justify-center text-white font-bold">
                        $${futureSize}B
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-between mt-4">
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-blue-500 mr-2 rounded-sm"></div>
                      <span class="text-sm text-gray-600">Current Market</span>
                    </div>
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-purple-500 mr-2 rounded-sm"></div>
                      <span class="text-sm text-gray-600">Projected Growth</span>
                    </div>
                  </div>
                </div>
              `;
              
              // Insert chart after market paragraph
              const newMarketContent = marketSection.replace(
                marketParaMatch[0],
                `${marketParaMatch[0]}${marketChart}`
              );
              
              // Replace in processed code
              processedCode = processedCode.substring(0, marketStart) + 
                             newMarketContent + 
                             processedCode.substring(marketStart + marketEnd);
            }
          }
        }
      }
      
      // Enhance Why Now section with a timeline
      if (processedCode.includes('Why Now')) {
        // Find the why now section
        const whyNowStart = processedCode.indexOf('<div class="section-title text-lg font-semibold text-gray-500 mb-2">Why Now Section</div>');
        if (whyNowStart !== -1) {
          // Extract Why Now content 
          let whyNowSection = processedCode.substring(whyNowStart);
          const nextSectionStart = whyNowSection.indexOf('<div class="section-title', 10);
          const endDiv = whyNowSection.indexOf('</div></div>', 10);
          
          let whyNowEnd = nextSectionStart !== -1 ? nextSectionStart : endDiv;
          if (whyNowEnd === -1) whyNowEnd = whyNowSection.length;
          
          whyNowSection = whyNowSection.substring(0, whyNowEnd);
          
          // Get paragraph containing why now info
          const whyNowParaMatch = whyNowSection.match(/<p[^>]*>(.*?)<\/p>/);
          if (whyNowParaMatch) {
            // Extract keywords from the paragraph
            const content = whyNowParaMatch[1];
            const keywords = content.split(/,|and|\.|;/).filter(k => k.trim().length > 3).slice(0, 3);
            
            // Create timeline
            const timeline = `
              <div class="mt-8 mb-6">
                <div class="relative">
                  <!-- Timeline Line -->
                  <div class="absolute h-full w-1 bg-blue-200 left-1/2 transform -translate-x-1/2 rounded"></div>
                  
                  <!-- Timeline Items -->
                  <div class="relative z-10">
                    <!-- Item 1 -->
                    <div class="flex items-center justify-between mb-12">
                      <div class="w-5/12 pr-8 text-right">
                        <h3 class="font-bold text-blue-600">${new Date().getFullYear() - 2}</h3>
                        <p class="text-sm text-gray-600">Rising healthcare costs create need for efficient solutions</p>
                      </div>
                      <div class="w-2/12 flex justify-center">
                        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="w-5/12 pl-8">
                        <p class="text-sm font-semibold">${keywords[0] || 'Key market trend'}</p>
                      </div>
                    </div>
                    
                    <!-- Item 2 -->
                    <div class="flex items-center justify-between mb-12">
                      <div class="w-5/12 pr-8 text-right">
                        <p class="text-sm font-semibold">${keywords[1] || 'Industry opportunity'}</p>
                      </div>
                      <div class="w-2/12 flex justify-center">
                        <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="w-5/12 pl-8">
                        <h3 class="font-bold text-indigo-600">${new Date().getFullYear()}</h3>
                        <p class="text-sm text-gray-600">Market demand creates perfect timing for our solution</p>
                      </div>
                    </div>
                    
                    <!-- Item 3 -->
                    <div class="flex items-center justify-between">
                      <div class="w-5/12 pr-8 text-right">
                        <h3 class="font-bold text-purple-600">${new Date().getFullYear() + 2}</h3>
                        <p class="text-sm text-gray-600">Projected market expansion and adoption</p>
                      </div>
                      <div class="w-2/12 flex justify-center">
                        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="w-5/12 pl-8">
                        <p class="text-sm font-semibold">${keywords[2] || 'Growth potential'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
            
            // Insert timeline after why now paragraph
            const newWhyNowContent = whyNowSection.replace(
              whyNowParaMatch[0],
              `${whyNowParaMatch[0]}${timeline}`
            );
            
            // Replace in processed code
            processedCode = processedCode.substring(0, whyNowStart) + 
                           newWhyNowContent + 
                           processedCode.substring(whyNowStart + whyNowEnd);
          }
        }
      }
      
      // Close the section divs - replace one section at a time to avoid s flag
      let sections = processedCode.split('<div class="mb-16 p-8 bg-white rounded-xl shadow-lg">');
      let newProcessedCode = sections[0];
      
      for (let i = 1; i < sections.length; i++) {
        if (i < sections.length - 1) {
          newProcessedCode += '<div class="mb-16 p-8 bg-white rounded-xl shadow-lg">' + 
                              sections[i] + 
                              '</div>';
        } else {
          newProcessedCode += '<div class="mb-16 p-8 bg-white rounded-xl shadow-lg">' + 
                              sections[i];
        }
      }
      
      processedCode = newProcessedCode;
      
      // Add the final closing div
      if (!processedCode.endsWith('</div>')) {
        processedCode += '</div>';
      }
      
      // Add solution feature cards styling 
      if (processedCode.includes('Solution')) {
        // Extract the solution section
        const solutionStart = processedCode.indexOf('<div class="section-title text-lg font-semibold text-gray-500 mb-2">Solution Section</div>');
        if (solutionStart !== -1) {
          let solutionSection = processedCode.substring(solutionStart);
          // Find the end of the section
          const nextSectionStart = solutionSection.indexOf('<div class="section-title', 10);
          const endDiv = solutionSection.indexOf('</div></div>', 10);
          
          // Determine where the section ends
          let solutionEnd = nextSectionStart !== -1 ? nextSectionStart : endDiv;
          if (solutionEnd === -1) solutionEnd = solutionSection.length;
          
          solutionSection = solutionSection.substring(0, solutionEnd);
          
          // Find the main solution content and the features
          const mainContent = solutionSection.match(/<div class="section-title[^>]*>Solution Section<\/div>.*?<p[^>]*>.*?<\/p>/);
          if (mainContent) {
            const featuresContent = solutionSection.substring(mainContent[0].length);
            
            // Parse the features content to create styled cards
            const featureItems = featuresContent.trim().split('</div>').filter(item => item.includes('<h3'));
            
            const styledCards = featureItems.map(item => {
              // Extract the title and description
              const titleMatch = item.match(/<h3[^>]*>(.*?)<\/h3>/);
              const descMatch = item.match(/<p[^>]*>(.*?)<\/p>/);
              
              if (titleMatch && descMatch) {
                const title = titleMatch[1];
                const description = descMatch[1];
                
                // Add icon based on title
                let icon = '';
                if (title.includes('Integration')) {
                  icon = '<svg class="w-12 h-12 mb-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clip-rule="evenodd"/></svg>';
                } else if (title.includes('Personal') || title.includes('Personalization')) {
                  icon = '<svg class="w-12 h-12 mb-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>';
                } else if (title.includes('Guidance') || title.includes('Guide')) {
                  icon = '<svg class="w-12 h-12 mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/></svg>';
                } else {
                  icon = '<svg class="w-12 h-12 mb-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd"/></svg>';
                }
                
                return `
                  <div class="bg-white p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
                    <div class="text-center">
                      ${icon}
                      <h3 class="text-xl font-bold text-gray-800 mb-2">${title}</h3>
                      <p class="text-gray-600">${description}</p>
                    </div>
                  </div>
                `;
              }
              return item;
            }).join('');
            
            // Style the features as cards
            const styledFeatures = `
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                ${styledCards || featuresContent}
              </div>
            `;
            
            // Replace the solution section in the full code
            processedCode = processedCode.substring(0, solutionStart + mainContent[0].length) + 
                           styledFeatures + 
                           processedCode.substring(solutionStart + solutionEnd);
          }
        }
      }
    }
    
    // Replace import statements
    processedCode = processedCode.replace(/import\s+{[^}]+}\s+from\s+['"]react-icons\/[^'"]+['"];?/g, '');
    
    // Replace icon usage with SVG
    Object.keys(iconSVGs).forEach(iconName => {
      const regex = new RegExp(`<${iconName}([^>]*)><\/${iconName}>`, 'g');
      processedCode = processedCode.replace(regex, (match, attributes) => {
        return `<span class="icon-container"${attributes}>${iconSVGs[iconName]}</span>`;
      });
    });
    
    // Allow tailwind classes through sanitization
    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
      if (node.hasAttribute('class')) {
        node.setAttribute('class', node.getAttribute('class') || '');
      }
    });
    
    // Sanitize the JSX code to prevent XSS attacks
    const sanitizedCode = DOMPurify.sanitize(processedCode);
    return sanitizedCode;
  }
  
  return (
    <>      
      {/* Add the styles to the page */}
      <style dangerouslySetInnerHTML={{ __html: pitchDeckStyles }} />
      
      {isLoading ? (
        // Enhanced loading state
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Generating your professional pitch deck...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      ) : error ? (
        // Error state with improved styling
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/market-research')}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Back to Market Research
              </Button>
              <Button
                onClick={fetchPitchDeckJSX}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Success state - render the JSX with better navigation
        <div className="relative pitch-deck-container">
          <div className="fixed top-4 right-4 z-50">
            <Button
              variant="outline"
              className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-300"
              onClick={() => router.push('/market-research')}
            >
              ← Back to Research
            </Button>
          </div>
          
          {/* Render the JSX pitch deck in a wrapper div */}
          <div 
            className="pitch-deck-content"
            dangerouslySetInnerHTML={{ __html: getSanitizedJSX() }} 
          />
        </div>
      )}
    </>
  )
} 