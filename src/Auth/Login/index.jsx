import React, { useState } from "react";
import image from "../../../assets/pexels-bayu-34768293.jpg";
import logo from "../../../assets/Logo.png";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../Context/AuthContext";


const Login = () => {
    const { login } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);

            const res = await axios.post(
                `${window.api}/login`,
                {
                    email: values.email,
                    password: values.password,
                }
            );

            const { token, user } = res.data;

            // Save user in AuthContext
            login(token, user);

            // Redirect according to role
            if (user.role === "owner") {
                navigate("/owner");
            } else {
                navigate("/employee");
            }

        } catch (error) {
            console.log(error);

            window.notify("Please enter valid email", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
            <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Left Image */}
                <div className="hidden md:block w-1/2">
                    <img
                        src={image}
                        alt="login"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <div className="w-[90%] max-w-md p-8">

                        {/* Logo */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={logo}
                                alt="logo"
                                className="h-20"
                            />
                        </div>

                        {/* Heading */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-green-700">
                                Smart Agro
                            </h2>

                            <p className="text-gray-500 text-sm">
                                Login to your dashboard
                            </p>
                        </div>

                        {/* Form */}
                        <Form
                            layout="vertical"
                            onFinish={onFinish}
                        >

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter email",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter password",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                style={{ height: 44 }}
                            >
                                Login
                            </Button>

                            <p className="text-center mt-4">
                                Don’t have an account?{" "}
                                <Link
                                    to="/auth/register"
                                    className="font-semibold underline"
                                >
                                    Sign Up
                                </Link>
                            </p>

                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;