// src/errors.ts
export const AppErrors = {
    VALIDATION_FAILED: {
      statusCode: 400,
      message: "Validation failed",
      error: "Bad Request"
    },
    NOT_FOUND: {
      statusCode: 404,
      message: "Resource not found", 
      error: "Not Found"
    },
    UNAUTHORIZED: {
      statusCode: 401,
      message: "Unauthorized access",
      error: "Unauthorized"
    }
  } as const; // "as const" makes these objects readonly


//   How to use the above is given below................


//   import { AppErrors } from '../errors';

// // Example 1: Throw predefined error
// throw AppErrors.VALIDATION_FAILED;

// // Example 2: Throw with custom message
// throw { 
//   ...AppErrors.NOT_FOUND, 
//   message: 'User not found with id: 123' 
// };

// // Example 3: In try-catch block
// try {
//   // your code
// } catch (error) {
//   throw AppErrors.INTERNAL_ERROR; 
// }