import React, { useState } from 'react';
import { Box, Button, Input, VStack, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/'
  : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

function AI() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // New state to handle errors

  // Function to format response with line breaks
  const formatResponse = (text) => {
    return text
      .replace(/([.;:])/g, '$1<br />') // Add <br /> after every ., :, and ;
      .replace(/\n/g, '<br />'); // Ensure newline characters are also converted to <br />
  };

  const handleSubmit = async () => {
    if (input.length > 100) {
      setError('Prompt exceeds 100 characters limit.');
      return;
    }
  
    setLoading(true);
    setError(''); // Reset error message
    try {
      const result = await axios.post(`${baseURL}api/AI/generate`, { prompt: input });
  
      // Check if the response is an object with the fields role, content, and refusal
      if (result.data.message && typeof result.data.message === 'object') {
        setResponse(formatResponse(result.data.message.content)); // Format the response content
      } else {
        setResponse(formatResponse(result.data.message)); // Fallback if the message is a string
      }
  
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <VStack spacing={4} mt={10}>
      <Input
        placeholder="Enter prompt (max 100 characters)"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError(''); // Clear error on input change
        }}
        size="md"
        width="300px"
        maxLength={100} // Limit input to 100 characters in the UI
      />
      <Button colorScheme="blue" onClick={handleSubmit} isDisabled={loading}>
        Generate
      </Button>

      {loading ? <Spinner /> : null}

      {response && !loading && (
        <Box
          width="100%"
          p={4}
          bg="gray.50"
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          shadow="md"
          mt={4}
          textAlign="left"
          dangerouslySetInnerHTML={{ __html: response }} // Render formatted response with <br />
        />
      )}

      {error && (
        <Alert status="error" width="300px">
          <AlertIcon />
          {error}
        </Alert>
      )}
    </VStack>
  );
}

export default AI;
