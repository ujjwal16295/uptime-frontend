"use client"
import React, { useState } from 'react';
import { Play, Clock, CheckCircle, XCircle, Copy, Download, RotateCcw, Globe, Code } from 'lucide-react';

export default function RouteTestingTool() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{}');
  const [body, setBody] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [error, setError] = useState(null);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  const testEndpoint = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setTestLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      // Parse headers
      let parsedHeaders = {};
      if (headers.trim()) {
        try {
          parsedHeaders = JSON.parse(headers);
        } catch (e) {
          throw new Error('Invalid JSON in headers');
        }
      }

      // Prepare request options
      const requestOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...parsedHeaders
        }
      };

      // Add body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        requestOptions.body = body;
      }

      const response = await fetch(url, requestOptions);
      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime);

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        ok: response.ok
      });
      setResponseTime(timeTaken);

    } catch (err) {
      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime);
      setResponseTime(timeTaken);
      setError(err.message);
    } finally {
      setTestLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    }
  };

  const downloadResponse = () => {
    if (response) {
      const dataStr = JSON.stringify(response, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'api-response.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const clearAll = () => {
    setUrl('');
    setMethod('GET');
    setHeaders('{}');
    setBody('');
    setResponse(null);
    setResponseTime(null);
    setError(null);
  };

  const formatResponseTime = (time) => {
    if (time < 1000) {
      return `${time}ms`;
    } else {
      return `${(time / 1000).toFixed(2)}s`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Globe className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-800">Request Configuration</h2>
            </div>

            {/* URL Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint URL
              </label>
              <div className="flex space-x-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Headers */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headers (JSON format)
              </label>
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{"Authorization": "Bearer token", "Custom-Header": "value"}'
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24 font-mono text-sm"
              />
            </div>

            {/* Request Body */}
            {['POST', 'PUT', 'PATCH'].includes(method) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32 font-mono text-sm"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={testEndpoint}
                disabled={testLoading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-700 hover:to-amber-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {testLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Test Endpoint</span>
                  </>
                )}
              </button>
              
              <button
                onClick={clearAll}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                title="Clear All"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Response Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Response</h2>
              </div>
              
              {response && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyResponse}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy Response"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadResponse}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download Response"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Response Time */}
            {responseTime !== null && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Response Time: {formatResponseTime(responseTime)}
                  </span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Error</span>
                </div>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Response */}
            {response && (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50">
                  {response.ok ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${response.ok ? 'text-green-800' : 'text-red-800'}`}>
                    {response.status} {response.statusText}
                  </span>
                </div>

                {/* Response Headers */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Response Headers</h3>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <pre className="text-xs font-mono text-gray-700">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Response Body */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Response Body</h3>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
                    <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                      {typeof response.data === 'string' 
                        ? response.data 
                        : JSON.stringify(response.data, null, 2)
                      }
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!response && !error && !testLoading && (
              <div className="text-center py-12 text-gray-500">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Configure your request and click "Test Endpoint" to see the response</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setUrl('https://jsonplaceholder.typicode.com/posts/1');
                setMethod('GET');
                setHeaders('{}');
                setBody('');
              }}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-800">GET Request</div>
              <div className="text-sm text-gray-600">Fetch a JSON resource</div>
            </button>
            
            <button
              onClick={() => {
                setUrl('https://jsonplaceholder.typicode.com/posts');
                setMethod('POST');
                setHeaders('{"Content-Type": "application/json"}');
                setBody('{\n  "title": "Test Post",\n  "body": "This is a test",\n  "userId": 1\n}');
              }}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-800">POST Request</div>
              <div className="text-sm text-gray-600">Create a new resource</div>
            </button>
            
            <button
              onClick={() => {
                setUrl('https://httpstat.us/200');
                setMethod('GET');
                setHeaders('{}');
                setBody('');
              }}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-800">Status Test</div>
              <div className="text-sm text-gray-600">Test HTTP status codes</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}