import pandas as pd

# Data for Authentication Module
auth_module_data = {
    "Test Case ID": ["1.1", "1.2", "1.3", "1.4", "1.5", "2.1", "2.2", "2.3", "2.4", "2.5"],
    "Test Case Name": [
        "New User Registration", "Duplicate Registration", "Password Validation", "Email Validation",
        "Registration Notification", "Valid Login", "Invalid Login", "Session Management",
        "Role Access Control", "Password Reset"
    ],
    "Steps": [
        "1. Navigate to registration page\n2. Enter new user details\n3. Submit form",
        "1. Attempt registration with existing email",
        "1. Test various password combinations",
        "1. Test various email formats",
        "1. Complete registration process",
        "1. Enter correct credentials\n2. Click login button",
        "1. Enter incorrect credentials",
        "1. Login and check session\n2. Close and reopen browser",
        "1. Login as different user roles",
        "1. Request password reset\n2. Complete reset process"
    ],
    "Expected Result": [
        "Account creation successful", "Error message shown", "Proper validation messages",
        "Proper email validation", "Success notification appears", "Successful login",
        "Error message shown", "Session persists appropriately", "Correct access permissions",
        "Password successfully reset"
    ],
    "Actual Result": [""] * 10,
    "Status": [""] * 10,
    "Notes": [""] * 10
}

# Data for Course Management Module
course_module_data = {
    "Test Case ID": ["3.1", "3.2", "3.3", "3.4", "4.1", "4.2", "4.3", "4.4"],
    "Test Case Name": [
        "Display Courses", "Course Filtering", "Course Search", "Course Details",
        "Course Enrollment", "Course Progress", "Course Content Access", "Course Completion"
    ],
    "Steps": [
        "1. Navigate to course catalog",
        "1. Apply various filters",
        "1. Search for specific courses",
        "1. View individual course",
        "1. Enroll in course",
        "1. Complete course units",
        "1. Access course materials",
        "1. Complete all units"
    ],
    "Expected Result": [
        "All courses visible", "Correct filtered results", "Relevant results shown",
        "Complete course information", "Successful enrollment", "Progress tracked accurately",
        "All content accessible", "Course marked complete"
    ],
    "Actual Result": [""] * 8,
    "Status": [""] * 8,
    "Notes": [""] * 8
}

# Data for Shopping Cart Module
cart_module_data = {
    "Test Case ID": ["5.1", "5.2", "5.3", "6.1", "6.2", "6.3", "6.4"],
    "Test Case Name": [
        "Add to Cart", "Remove from Cart", "Cart Calculation", "Payment Processing",
        "Order Confirmation", "Course Access", "Receipt Generation"
    ],
    "Steps": [
        "1. Add course to cart",
        "1. Remove course from cart",
        "1. Add multiple items",
        "1. Complete payment process",
        "1. Verify order details",
        "1. Check course availability",
        "1. Check payment receipt"
    ],
    "Expected Result": [
        "Course added successfully", "Course removed successfully", "Correct total calculation",
        "Payment successful", "Confirmation received", "Immediate access granted",
        "Proper receipt generated"
    ],
    "Actual Result": [""] * 7,
    "Status": [""] * 7,
    "Notes": [""] * 7
}

# Data for Admin Dashboard Module
admin_module_data = {
    "Test Case ID": ["7.1", "7.2", "7.3", "8.1", "8.2", "8.3", "9.1", "9.2", "9.3", "9.4"],
    "Test Case Name": [
        "Revenue Tracking", "User Statistics", "Course Analytics", "User List",
        "Role Management", "User Actions", "Course Creation", "Course Editing",
        "Course Deletion", "Content Management"
    ],
    "Steps": [
        "1. Check revenue data",
        "1. View user growth data",
        "1. Review course performance",
        "1. Access user directory",
        "1. Modify user roles",
        "1. Perform user operations",
        "1. Create new course",
        "1. Modify course details",
        "1. Remove course",
        "1. Manage course content"
    ],
    "Expected Result": [
        "Accurate financial data", "Correct user statistics", "Accurate metrics shown",
        "Complete user list", "Role updates successful", "Actions completed successfully",
        "Course added to system", "Updates saved successfully", "Course properly removed",
        "Content updates successful"
    ],
    "Actual Result": [""] * 10,
    "Status": [""] * 10,
    "Notes": [""] * 10
}

# Data for Performance Testing
performance_data = {
    "Metric": ["Load Time", "Response Time", "Error Rate", "Success Rate", "System Uptime"],
    "Target": ["< 3 seconds", "< 1 second", "< 1%", "> 95%", "> 99.9%"],
    "Actual": [""] * 5,
    "Status": [""] * 5,
    "Notes": [""] * 5
}

# Data for Test Environment
environment_data = {
    "Category": ["Browsers", "Devices", "Network", "Resolution"],
    "Details": [
        "Chrome, Firefox, Safari",
        "Desktop, Mobile, Tablet",
        "Various speeds",
        "Multiple screen sizes"
    ]
}

# Create DataFrames
auth_module_df = pd.DataFrame(auth_module_data)
course_module_df = pd.DataFrame(course_module_data)
cart_module_df = pd.DataFrame(cart_module_data)
admin_module_df = pd.DataFrame(admin_module_data)
performance_df = pd.DataFrame(performance_data)
environment_df = pd.DataFrame(environment_data)

# Save to Excel
with pd.ExcelWriter("Test_Cases_Documentation.xlsx") as writer:
    auth_module_df.to_excel(writer, sheet_name="Authentication Module", index=False)
    course_module_df.to_excel(writer, sheet_name="Course Management Module", index=False)
    cart_module_df.to_excel(writer, sheet_name="Shopping Cart Module", index=False)
    admin_module_df.to_excel(writer, sheet_name="Admin Dashboard Module", index=False)
    performance_df.to_excel(writer, sheet_name="Performance Testing", index=False)
    environment_df.to_excel(writer, sheet_name="Test Environment", index=False)

print("Excel file 'Test_Cases_Documentation.xlsx' created successfully!")