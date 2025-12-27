import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            navigate('/dashboard');
        } catch (error: any) {
            // Firebase auth error codes
            let errorMessage = "Contact admin";
            
            if (error.code === 'auth/wrong-password') {
                errorMessage = "Password is incorrect";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = "Email not found. Please sign up first";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Try again later";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast({
                title: "Login Failed",
                description: errorMessage,
                variant: "destructive",
            });
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login to EyeQ</CardTitle>
                    <CardDescription>Welcome back, member!</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/signup')}>Sign up</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
