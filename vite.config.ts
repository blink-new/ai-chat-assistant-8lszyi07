
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    middleware: {
      // Handle API requests
      '/src/api/chat': async (req, res, next) => {
        if (req.method === 'POST') {
          try {
            const { POST } = await import('./src/api/chat');
            const response = await POST(req);
            
            // Set headers from the response
            response.headers.forEach((value, key) => {
              res.setHeader(key, value);
            });
            
            // Set status code
            res.statusCode = response.status;
            
            // Stream the response
            const reader = response.body?.getReader();
            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
              }
              res.end();
            }
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      },
    },
  },
});