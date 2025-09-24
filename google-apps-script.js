// Google Apps Script to save form data to Google Drive CSV and send email notifications
// Deploy this as a web app and get the URL to replace in your website

function doGet(e) {
  // Handle GET requests (when someone visits the URL directly)
  return ContentService
    .createTextOutput(JSON.stringify({ 
      'status': 'success', 
      'message': 'Metal Streets Media Contact Form Handler is running',
      'usage': 'This endpoint accepts POST requests from the contact form'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Get form data
    const formData = e.parameter;
    const timestamp = formData.timestamp || new Date().toLocaleString();
    const name = formData.name || '';
    const email = formData.email || '';
    const phone = formData.phone || '';
    const country = formData.country || '';
    const businessType = formData.businessType || '';
    const services = formData.services || '';
    
    // Create CSV row
    const csvRow = `"${timestamp}","${name}","${email}","${phone}","${country}","${businessType}","${services}"\n`;
    
    // Get or create the CSV file in Google Drive
    const fileName = 'Metal_Streets_Media_Contact_Submissions.csv';
    let file = getOrCreateCSVFile(fileName);
    
    // Append data to the file
    appendToCSVFile(file, csvRow);
    
    // Send email notification
    sendEmailNotification(name, email, phone, country, businessType, services, timestamp);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'status': 'success', 'message': 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateCSVFile(fileName) {
  // Search for existing file
  const files = DriveApp.getFilesByName(fileName);
  
  if (files.hasNext()) {
    // File exists, return it
    return files.next();
  } else {
    // Create new file with headers
    const headers = 'Timestamp,Name,Email,Phone,Country,Business Type,Services\n';
    const file = DriveApp.createFile(fileName, headers, MimeType.CSV);
    return file;
  }
}

function appendToCSVFile(file, csvRow) {
  // Get current content
  const currentContent = file.getBlob().getDataAsString();
  
  // Append new row
  const newContent = currentContent + csvRow;
  
  // Update file
  file.setContent(newContent);
}

function sendEmailNotification(name, email, phone, country, businessType, services, timestamp) {
  const recipientEmail = 'metalstreetmedia@gmail.com';
  const subject = 'New Contact Form Submission - Metal Streets Media';
  
  // Create HTML email body
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px; text-align: center;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #555; margin-top: 0;">Submission Details:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Timestamp:</td>
              <td style="padding: 8px 0; color: #666;">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td>
              <td style="padding: 8px 0; color: #666;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 8px 0; color: #666;">
                <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td>
              <td style="padding: 8px 0; color: #666;">
                <a href="tel:${phone}" style="color: #007bff; text-decoration: none;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Country:</td>
              <td style="padding: 8px 0; color: #666;">${country}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Business Type:</td>
              <td style="padding: 8px 0; color: #666;">${businessType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Services Required:</td>
              <td style="padding: 8px 0; color: #666;">${services}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; margin-bottom: 15px;">This submission has been automatically saved to your Google Drive CSV file.</p>
          <a href="mailto:${email}?subject=Re: Your inquiry to Metal Streets Media" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reply to ${name}
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This is an automated notification from your Metal Streets Media contact form.
          </p>
        </div>
      </div>
    </div>
  `;
  
  // Create plain text version for email clients that don't support HTML
  const plainTextBody = `
New Contact Form Submission - Metal Streets Media

Submission Details:
- Timestamp: ${timestamp}
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Country: ${country}
- Business Type: ${businessType}
- Services Required: ${services}

This submission has been automatically saved to your Google Drive CSV file.

You can reply directly to ${email} to follow up on this inquiry.

---
This is an automated notification from your Metal Streets Media contact form.
  `;
  
  try {
    // Send the email
    GmailApp.sendEmail(
      recipientEmail,
      subject,
      plainTextBody,
      {
        htmlBody: htmlBody,
        name: 'Metal Streets Media Contact Form'
      }
    );
    
    // Log successful email send
    Logger.log('Email notification sent successfully to ' + recipientEmail);
    
  } catch (emailError) {
    // Log email error but don't fail the entire request
    Logger.log('Error sending email notification: ' + emailError.toString());
  }
}

// Test function to verify setup
function testSetup() {
  const testData = {
    timestamp: new Date().toLocaleString(),
    name: 'Test User',
    email: 'test@example.com',
    phone: '+91 1234567890',
    country: 'India',
    businessType: 'Startup',
    services: 'Digital Marketing, Website Creation'
  };
  
  const csvRow = `"${testData.timestamp}","${testData.name}","${testData.email}","${testData.phone}","${testData.country}","${testData.businessType}","${testData.services}"\n`;
  
  const fileName = 'Metal_Streets_Media_Contact_Submissions.csv';
  let file = getOrCreateCSVFile(fileName);
  appendToCSVFile(file, csvRow);
  
  // Test email notification
  sendEmailNotification(
    testData.name,
    testData.email,
    testData.phone,
    testData.country,
    testData.businessType,
    testData.services,
    testData.timestamp
  );
  
  Logger.log('Test data saved successfully!');
  Logger.log('Test email notification sent!');
  Logger.log('File URL: ' + file.getUrl());
}

// Function to test the web app endpoint
function testWebApp() {
  // Simulate a POST request to test the doPost function
  const mockEvent = {
    parameter: {
      timestamp: new Date().toLocaleString(),
      name: 'Web App Test',
      email: 'test@example.com',
      phone: '+91 9876543210',
      country: 'India',
      businessType: 'Test Business',
      services: 'Website Creation, Digital Marketing'
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Web app test result:', result.getContent());
  return result;
}

