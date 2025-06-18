import { GetFixesQuery } from '../../../../src/features/analysis/scm/generates/client_generates'

export const mockGetMCPFixes: { data: GetFixesQuery } = {
  data: {
    fixes: [
      {
        __typename: 'fix' as const,
        id: 'test-fix-1',
        patchAndQuestions: {
          __typename: 'FixData' as const,
          patch: `diff --git a/src/database/queries.js b/src/database/queries.js
index 1234567..abcdefg 100644
--- a/src/database/queries.js
+++ b/src/database/queries.js
@@ -39,7 +39,8 @@ function getUserById(userId) {
   if (!userId) {
     throw new Error('User ID is required');
   }
-  const query = "SELECT * FROM users WHERE id = " + userId;
-  return db.query(query);
+  const query = "SELECT * FROM users WHERE id = ?";
+  return db.query(query, [userId]);
 }`,
          patchOriginalEncodingBase64:
            'Y29uc3QgcXVlcnkgPSAiU0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSBpZCA9ID8iOyBkYi5xdWVyeShxdWVyeSwgW3VzZXJJZF0pOw==',
          questions: [],
          extraContext: {
            __typename: 'FixExtraContextResponse' as const,
            fixDescription:
              'Fixed SQL injection vulnerability by using parameterized queries',
            extraContext: [],
            manifestActionsRequired: [],
          },
        },
      },
      {
        __typename: 'fix' as const,
        id: 'test-fix-2',
        patchAndQuestions: {
          __typename: 'FixData' as const,
          patch: `diff --git a/src/components/UserProfile.jsx b/src/components/UserProfile.jsx
index 9876543..fedcba9 100644
--- a/src/components/UserProfile.jsx
+++ b/src/components/UserProfile.jsx
@@ -12,7 +12,8 @@ function UserProfile({ user }) {
   return (
     <div className="user-profile">
       <h1>Welcome, {user.name}!</h1>
-      <p dangerouslySetInnerHTML={{__html: user.bio}} />
+      <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(user.bio)}} />
     </div>
   );
 }`,
          patchOriginalEncodingBase64:
            'Y29uc3Qgc2FuaXRpemVkTmFtZSA9IERPTVB1cmlmeS5zYW5pdGl6ZSh1c2VyLm5hbWUpOw==',
          questions: [],
          extraContext: {
            __typename: 'FixExtraContextResponse' as const,
            fixDescription: 'Fixed XSS vulnerability by sanitizing user input',
            extraContext: [],
            manifestActionsRequired: [],
          },
        },
      },
    ],
  },
}

export const mockGetMCPFixesError = (message: string) => ({
  errors: [
    {
      message: message || 'Get Fixes Error',
    },
  ],
})

export const mockGetMCPFixesEmpty: { data: GetFixesQuery } = {
  data: {
    fixes: [], // Empty fixes array
  },
}
