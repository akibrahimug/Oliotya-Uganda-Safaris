"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function CMSTestPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    if (isLoaded) {
      const results = {
        isSignedIn,
        userId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
        publicMetadata: user?.publicMetadata,
        organizationMemberships: user?.organizationMemberships,
        isAdmin: user?.publicMetadata?.role === "admin",
        hasOrganizations: Array.isArray(user?.organizationMemberships),
      };
      setTestResults(results);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CMS Authentication Test</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>

        {!isSignedIn && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              You are not signed in. Please sign in to test CMS access.
            </p>
          </div>
        )}

        {isSignedIn && !testResults.isAdmin && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">
              You are not an admin. To access CMS:
            </p>
            <ol className="list-decimal ml-6 mt-2 space-y-1">
              <li>Go to Clerk Dashboard</li>
              <li>Find your user account</li>
              <li>In Metadata section, add to Public Metadata:</li>
            </ol>
            <pre className="bg-white p-2 rounded mt-2 border">
              {JSON.stringify({ role: "admin" }, null, 2)}
            </pre>
          </div>
        )}

        {isSignedIn && testResults.isAdmin && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              ✅ You have admin access! You can access the CMS.
            </p>
            <a
              href="/cms"
              className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to CMS →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
