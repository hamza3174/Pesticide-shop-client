import { Button, Form, Input, Row, Col, Card } from 'antd'
import React from 'react'
import { IoPerson } from 'react-icons/io5'
import { MdPersonAddAlt1 } from 'react-icons/md'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../Context/AuthContext'

const Register = () => {

    const navigate = useNavigate();
    const { login, loading, setLoading } = useAuthContext();
    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            window.notify("Passwords do not match", "error");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${window.api}/register`,
                {
                    name: values.name,
                    shopName: values.shopName,
                    email: values.email,
                    phone: values.phone,
                    password: values.password,
                    address: values.address
                }
            );

            console.log("REGISTER RESPONSE:", res.data);

            if (res.data.token && res.data.user) {

                // ✅ Save token + complete user object
                login(
                    res.data.token,
                    res.data.user
                );

                window.notify(
                    "Registration successful!",
                    "success"
                );

                navigate("/owner");

            } else {

                window.notify(
                    "Registration failed",
                    "error"
                );

            }

        } catch (error) {

            console.log(error);

            window.notify(
                error.response?.data?.message ||
                "Registration failed",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className='flex justify-center items-center'
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#e6f4ff,#f0f5ff)"
            }}
        >

            <Card
                style={{
                    width: "500px",
                    borderRadius: "15px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                }}
            >

                {/* HEADER */}
                <div className='flex flex-col items-center mb-6'>
                    <div className='bg-green-600 p-4 rounded-full mb-2'>
                        <IoPerson size={28} className='text-white' />
                    </div>

                    <h2 className='text-2xl font-bold'>Create Your Account</h2>

                    <p className='text-gray-500 text-center'>
                        Manage your pesticide shop smartly
                    </p>
                </div>

                {/* FORM */}
                <Form layout="vertical" onFinish={onFinish}>

                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[{ required: true, message: "Enter your name" }]}
                            >
                                <Input placeholder='Enter your name' />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Shop Name"
                                name="shopName"
                                rules={[{ required: true, message: "Enter shop name" }]}
                            >
                                <Input placeholder='Enter shop name' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Enter email" }]}
                    >
                        <Input placeholder='Enter email' />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                    >
                        <Input placeholder='Enter phone number' />
                    </Form.Item>

                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true }]}
                            >
                                <Input.Password placeholder='Password' />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                rules={[{ required: true }]}
                            >
                                <Input.Password placeholder='Confirm password' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Shop Address"
                        name="address"
                    >
                        <Input placeholder='Enter shop address' />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        size="large"
                        style={{
                            borderRadius: "10px",
                            background: "#16a34a",
                            border: "none"
                        }}
                    >
                        <MdPersonAddAlt1 style={{ marginRight: "6px" }} size={20} />
                        Create Account
                    </Button>

                    <div className="m-4">
                        <p className="text-center flex justify-center gap-2 text-[16px] font-semibold" >
                            Already have an account <Link to="/auth/login">
                                <span className="font-bold underline">
                                    SignIn
                                </span></Link>
                        </p>
                    </div>

                </Form>

            </Card>

        </div>
    )
}

export default Register;