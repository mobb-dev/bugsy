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
export const multupleVulnerableFileContent = `import subprocess

${vulnerablePyFunction('test')}
${vulnerablePyFunction('test2')}
    delete_user_folder_test('test')
    delete_user_folder_test2('test2')
    `
