/**
 * Helper file containing sample benign and intentionally vulnerable code snippets
 * used across the test suite.
 */

// Simple benign Python snippet used as placeholder content
export const benignFileContent = `import subprocess

def run_admin_command():
    subprocess.run(default_admin_action, shell=True)
    `

// Internal helper to generate vulnerable Python functions dynamically
const vulnerablePyFunction = (name: string) => `
def delete_user_folder_${name}(name):
    delete_cmd = f"rm -rf /home/{name}"
    subprocess.run(delete_cmd, shell=True)
    `

// A single vulnerable snippet leveraging the helper above
export const vulnerableFileContent = `import subprocess

${vulnerablePyFunction('test')}
    delete_user_folder_test('test')
  `

// A longer file containing multiple vulnerable functions
export const multipleVulnerableFileContent = `import subprocess

${vulnerablePyFunction('test')}
${vulnerablePyFunction('test2')}
    delete_user_folder_test('test')
    delete_user_folder_test2('test2')
    `

// Java file with hardcoded password vulnerability matching the mock report.json
export const javaVulnerableFileContent = `import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class SQLInjectionExample {
    private static final String PASSWORD = "hardcodedPassword123"; // Hardcoded password vulnerability - line 7

    public Connection getConnection() {
        try {
            return DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/testdb",
                "admin",
                PASSWORD
            );
        } catch (Exception e) {
            return null;
        }
    }
}`

// JavaScript file with single command injection vulnerability
export const jsVulnerableFileContent = `// JavaScript vulnerable file with command injection
const {exec} = require('child_process');

function execute_user_command(user_cmd) {
    // Command injection vulnerability
    const full_cmd = \`echo 'Processing: {user_cmd}'\`;
    exec(full_cmd, { shell: true }, callback);
}

module.exports = {execute_user_command};`

// Python file with single SQL injection vulnerability
export const pyVulnerableFileContent = `# Python vulnerable file with SQL injection
import sqlite3

def get_user_data(user_id):
    # SQL injection vulnerability
    query = "SELECT * FROM users WHERE id = " + user_id
    cursor.execute(query)
    return cursor.fetchall()`

// HTML file with single CSRF vulnerability
export const htmlVulnerableFileContent = `<!DOCTYPE html>
<html>
<head>
    <title>Login Page</title>
</head>
<body>
    <h1>User Login</h1>
    
    <!-- CSRF vulnerability - form action pointing to external domain -->
    <form action="http://example.com/login" method="post">
        <input type="password" name="password" />
        <input type="submit" value="Login" />
    </form>
</body>
</html>`

// JavaScript file with hardcoded password vulnerability
export const authVulnerableFileContent = `function authenticateUser(password) {
  if (password == "admin123") {  // Hardcoded password vulnerability
    return true;
  }
  return false;
}`

// Python file with multiple vulnerabilities for testing fix prioritization
export const multiVulnerableFileContent = `# Python file with multiple vulnerabilities
import subprocess
import sqlite3

def get_user_data(user_id):
    # SQL injection vulnerability
    query = "SELECT * FROM users WHERE id = " + user_id
    cursor.execute(query)
    return cursor.fetchall()

def execute_user_command(user_cmd):
    # Command injection vulnerability
    full_cmd = f"echo 'Processing: {user_cmd}'"
    subprocess.run(full_cmd, shell=True)

def delete_user_folder(username):
    # Another command injection vulnerability
    delete_cmd = f"rm -rf /tmp/{username}"
    subprocess.run(delete_cmd, shell=True)`
