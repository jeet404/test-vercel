const MESSAGES = {
  // Authentication
  1001: "User not found",
  1002: "Sign in successfully",
  1003: "User details added successfully",
  1004: "Your credentials do not match our records",
  1005: "Incorrect password!",
  1006: "Get profile successfully",
  1007: "Logout successfully",
  1008: "User registered successfully",
  1009: "Profile updated successfully!",
  1010: "Update user successfully",
  1011: "Password changed successfully",
  1012: "User deleted successfully",
  1013: "User Already Exists",
  1014: "User Created Successfully",
  1015: "User details fetched successfully",
  1016: "User Status Updated Successfully",

  // Team
  2001: "Team not found",
  2002: "Team created successfully",
  2003: "Team updated successfully",
  2004: "Team deleted successfully",
  2005: "Team details fetched successfully",
  2006: "Team already exists",

  // Project
  3001: "Project not found",
  3002: "Project created successfully",
  3003: "Project updated successfully",
  3004: "Project deleted successfully",
  3005: "Project details fetched successfully",
  3006: "Project already exists",

  // Board
  4001: "Board not found",
  4002: "Board created successfully",
  4003: "Board updated successfully",
  4004: "Board deleted successfully",
  4005: "Board details fetched successfully",
  4006: "Board already exists",

  // Common
  9000: "Please Enter Valid data!",
  9001: "Not found",
  9002: "You are not authorized to perform this action",
  9999: "Something went wrong!",
};

module.exports.getMessage = function (messageCode) {
  if (isNaN(messageCode)) {
    return messageCode;
  }
  return messageCode ? MESSAGES[messageCode] : "";
};
