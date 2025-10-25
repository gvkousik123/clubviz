'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    AuthService,
    SearchService,
    SuperAdminService,
    SessionService,
    MobileAuthService
} from '@/lib/services';

export default function APIIntegrationDemo() {
    const [results, setResults] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('club');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState<'USER' | 'ADMIN' | 'SUPERADMIN'>('USER');
    const [googleToken, setGoogleToken] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');

    const handleApiCall = async (apiFunction: () => Promise<any>, description: string) => {
        setLoading(true);
        setResults(`${description}...\n\n`);

        try {
            const result = await apiFunction();
            setResults(prev => prev + `✅ Success!\n\n${JSON.stringify(result, null, 2)}`);
        } catch (error: any) {
            setResults(prev => prev + `❌ Error: ${error.message}\n\n${JSON.stringify(error, null, 2)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">API Integration Demo</h1>
                <p className="text-muted-foreground">
                    Test all integrated API endpoints from the ClubViz backend
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Tabs defaultValue="search" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="search">Search</TabsTrigger>
                            <TabsTrigger value="auth">Auth</TabsTrigger>
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                            <TabsTrigger value="session">Session</TabsTrigger>
                        </TabsList>

                        <TabsContent value="search" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Smart Search API</CardTitle>
                                    <CardDescription>Test the smart search functionality</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Search query..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <Button
                                            onClick={() => handleApiCall(
                                                () => SearchService.smartSearch(searchQuery),
                                                'Testing Smart Search'
                                            )}
                                            disabled={loading}
                                        >
                                            Search
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => SearchService.getSearchCategories(),
                                                'Getting Search Categories'
                                            )}
                                            disabled={loading}
                                        >
                                            Get Categories
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => SearchService.getSearchSuggestions(searchQuery),
                                                'Getting Search Suggestions'
                                            )}
                                            disabled={loading}
                                        >
                                            Get Suggestions
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="auth" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Authentication APIs</CardTitle>
                                    <CardDescription>Test authentication endpoints</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Google ID Token..."
                                            value={googleToken}
                                            onChange={(e) => setGoogleToken(e.target.value)}
                                        />
                                        <Button
                                            onClick={() => handleApiCall(
                                                () => AuthService.googleSignIn(googleToken),
                                                'Testing Google Sign-In'
                                            )}
                                            disabled={loading || !googleToken}
                                        >
                                            Google Sign-In
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Email for OTP..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => MobileAuthService.sendEmailOTP(email),
                                                'Sending Email OTP'
                                            )}
                                            disabled={loading || !email}
                                        >
                                            Send Email OTP
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Mobile number..."
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => MobileAuthService.sendMobileOTP(mobile),
                                                'Sending Mobile OTP'
                                            )}
                                            disabled={loading || !mobile}
                                        >
                                            Send Mobile OTP
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="admin" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin & Role Management</CardTitle>
                                    <CardDescription>Test admin and role management endpoints</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Username..."
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value as any)}
                                            className="px-3 py-2 border rounded"
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="SUPERADMIN">SUPERADMIN</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => SuperAdminService.addRole(username, role),
                                                `Adding ${role} role to ${username}`
                                            )}
                                            disabled={loading || !username}
                                        >
                                            Add Role
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => SuperAdminService.removeRole(username, role),
                                                `Removing ${role} role from ${username}`
                                            )}
                                            disabled={loading || !username}
                                        >
                                            Remove Role
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => SuperAdminService.activateUser(username),
                                                `Activating user ${username}`
                                            )}
                                            disabled={loading || !username}
                                        >
                                            Activate User
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => SuperAdminService.deactivateUser(username),
                                                `Deactivating user ${username}`
                                            )}
                                            disabled={loading || !username}
                                        >
                                            Deactivate User
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={() => handleApiCall(
                                            () => SuperAdminService.getAdminStats(),
                                            'Getting Admin Statistics'
                                        )}
                                        disabled={loading}
                                    >
                                        Get Admin Stats
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="session" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Session Management</CardTitle>
                                    <CardDescription>Test session and CORS endpoints</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Button
                                            onClick={() => handleApiCall(
                                                () => SessionService.getCorsOrigins(),
                                                'Getting CORS Origins'
                                            )}
                                            disabled={loading}
                                        >
                                            Get CORS Origins
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => handleApiCall(
                                                () => SessionService.getUserSessions(),
                                                'Getting User Sessions'
                                            )}
                                            disabled={loading}
                                        >
                                            Get Sessions
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            onClick={() => handleApiCall(
                                                () => SessionService.revokeAllSessions(),
                                                'Revoking All Sessions'
                                            )}
                                            disabled={loading}
                                        >
                                            Revoke All Sessions
                                        </Button>
                                    </div>

                                    <div className="p-4 bg-muted rounded-lg">
                                        <h4 className="font-medium mb-2">Current Session Info</h4>
                                        <div className="space-y-1 text-sm">
                                            <div>Authenticated: <Badge variant={SessionService.isAuthenticated() ? 'default' : 'destructive'}>
                                                {SessionService.isAuthenticated() ? 'Yes' : 'No'}
                                            </Badge></div>
                                            <div>Has Admin Role: <Badge variant={SessionService.hasRole('ADMIN') ? 'default' : 'secondary'}>
                                                {SessionService.hasRole('ADMIN') ? 'Yes' : 'No'}
                                            </Badge></div>
                                            <div>Has SuperAdmin Role: <Badge variant={SessionService.hasRole('SUPERADMIN') ? 'default' : 'secondary'}>
                                                {SessionService.hasRole('SUPERADMIN') ? 'Yes' : 'No'}
                                            </Badge></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>API Response</CardTitle>
                            <CardDescription>
                                {loading ? 'Loading...' : 'Response will appear here'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                                {results || 'No API calls made yet...'}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Integration Status</CardTitle>
                        <CardDescription>Current API integrations status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-green-600">✅ Smart Search</h4>
                                <p className="text-sm text-muted-foreground">GET /search/smart</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-green-600">✅ Google Auth</h4>
                                <p className="text-sm text-muted-foreground">POST /auth/google</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-green-600">✅ Role Management</h4>
                                <p className="text-sm text-muted-foreground">POST /auth/roles/*</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-green-600">✅ Session Management</h4>
                                <p className="text-sm text-muted-foreground">GET/DELETE /auth/sessions</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-green-600">✅ OTP Services</h4>
                                <p className="text-sm text-muted-foreground">POST /auth/password-reset/*</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-green-600">✅ CORS Origins</h4>
                                <p className="text-sm text-muted-foreground">GET /auth/cors-origins</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-green-600">✅ Admin Stats</h4>
                                <p className="text-sm text-muted-foreground">GET /admin/stats</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-red-600">❌ Test APIs</h4>
                                <p className="text-sm text-muted-foreground">Removed as requested</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}