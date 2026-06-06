import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    DatePicker,
    Table,
    Card,
    Tag,
    Row,
    Col
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { MdFactCheck } from "react-icons/md";
import { FaCube } from "react-icons/fa";
import axios from "axios";
import { UseProductContext } from "../../../../Context/ProductContext";

const { Option } = Select;

const StockMangement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);

    const { products, setProducts } = UseProductContext();

    const token = localStorage.getItem("token");

    // ✅ FETCH PRODUCTS ON LOAD (Logic completely untouched)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(
                    `${window.api}/products`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                setProducts(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        if (token) {
            fetchProducts();
        }
    }, [token, setProducts]);

    // ✅ ADD PRODUCT (Logic completely untouched)
    const onFinish = async (values) => {
        setLoading(true);

        const newProduct = {
            ...values,
            expiryDate: values.expiryDate
                ? values.expiryDate.format("YYYY-MM-DD")
                : null
        };

        try {
            const res = await axios.post(
                `${window.api}/products`,
                newProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProducts((prev) => [...prev, res.data]);
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    // 📊 STATS
    const totalProducts = products.length;
    const lowStock = products.filter(
        (p) => p.stockQuantity <= p.reorderLevel
    ).length;

    // 🎨 CATEGORY TAG
    const getCategoryTag = (category) => {
        const map = {
            Pesticide: "volcano",
            Fertilizer: "green",
            Seed: "blue"
        };
        return <Tag color={map[category] || "default"}>{category}</Tag>;
    };

    // 🔍 SEARCH FILTER
    const filteredData = products.filter((p) =>
        p.productName?.toLowerCase().includes(searchText.toLowerCase())
    );

    // 📋 TABLE COLUMNS (Enhanced typography and layouts)
    const columns = [
        {
            title: "Product",
            dataIndex: "productName",
            render: (text) => <span className="font-semibold text-gray-800">{text}</span>
        },
        {
            title: "Category",
            dataIndex: "category",
            render: (category) => getCategoryTag(category)
        },
        { title: "Company", dataIndex: "company" },
        { title: "Pack Size", dataIndex: "packagingSize" },
        {
            title: "Buy Price",
            dataIndex: "purchasePrice",
            render: (val) => <span className="font-medium text-gray-600">Rs. {val}</span>
        },
        {
            title: "Sell Price",
            dataIndex: "sellingPrice",
            render: (val) => <span className="font-semibold text-emerald-600">Rs. {val}</span>
        },
        {
            title: "Stock Status",
            dataIndex: "stockQuantity",
            render: (qty, record) => {
                const isLow = qty <= record.reorderLevel;
                return (
                    <Tag className="px-2.5 py-0.5 rounded-full font-medium" color={isLow ? "error" : "success"}>
                        {isLow ? `${qty} (Low)` : `${qty} Available`}
                    </Tag>
                );
            }
        },
        {
            title: "Expiry",
            dataIndex: "expiryDate",
            render: (date) => date ? <span className="text-gray-500 text-sm">{date}</span> : <span className="text-gray-400 text-xs">-</span>
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-gray-800">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <span>📦</span> Stock Dashboard
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5">Manage and track your agricultural store inventory</p>
                    </div>

                    <div className="flex flex-col xs:flex-row items-stretch gap-3 w-full sm:w-auto">
                        <Input
                            className="h-10 rounded-lg xs:w-64 sm:w-72"
                            prefix={<SearchOutlined className="text-slate-400" />}
                            placeholder="Search product by name..."
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                        <Button
                            className="h-10 rounded-lg font-medium shadow-sm"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalOpen(true)}
                            type="primary"
                        >
                            Add New Product
                        </Button>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    {/* CARD 1: TOTAL PRODUCTS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500" />
                        <div className="p-4 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-105 transition-transform duration-200">
                            <FaCube size={24} />
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium text-sm block uppercase tracking-wider">Total Products</span>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalProducts}</h3>
                        </div>
                    </div>

                    {/* CARD 2: LOW STOCK WARNING */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-rose-500" />
                        <div className="p-4 bg-rose-50 rounded-xl text-rose-600 group-hover:scale-105 transition-transform duration-200">
                            <MdFactCheck size={24} />
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium text-sm block uppercase tracking-wider">Low Stock Alerts</span>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{lowStock}</h3>
                        </div>
                    </div>
                </div>

                {/* DATA TABLE CONTAINER */}
                <Card className="shadow-sm border border-slate-100 rounded-2xl overflow-hidden body-p-0">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            className: "px-6 py-4 border-t border-slate-100",
                            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`
                        }}
                        scroll={{ x: 900 }} // Prevents table layout crunching on small viewports
                        className="custom-table"
                    />
                </Card>

                {/* PRODUCT CREATION MODAL */}
                <Modal
                    title={<span className="text-lg font-bold text-slate-800 block pb-2 border-b border-slate-100">Add New Inventory Product</span>}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    centered
                    width={640}
                    destroyOnClose
                >
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                        className="mt-4 space-y-1"
                    >
                        <Row gutter={[16, 0]}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="productName" label="Product Name" rules={[{ required: true, message: "Please input product name!" }]}>
                                    <Input className="h-10 rounded-md" placeholder="e.g., Alpha Fertilizer" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="category" label="Category">
                                    <Select className="h-10 rounded-md w-full" placeholder="Select category">
                                        <Option value="Pesticide">Pesticide</Option>
                                        <Option value="Fertilizer">Fertilizer</Option>
                                        <Option value="Seed">Seed</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 0]}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="company" label="Company Brand">
                                    <Input className="h-10 rounded-md" placeholder="e.g., AgriCorp" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="packagingSize" label="Packaging Size">
                                    <Input className="h-10 rounded-md" placeholder="e.g., 5 KG, 1 Litre" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 0]}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="purchasePrice" label="Cost Price (Rs.)">
                                    <Input type="number" className="h-10 rounded-md" placeholder="0.00" min={0} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="sellingPrice" label="Retail Price (Rs.)">
                                    <Input type="number" className="h-10 rounded-md" placeholder="0.00" min={0} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 0]}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="stockQuantity" label="Initial Stock Units">
                                    <Input type="number" className="h-10 rounded-md" placeholder="0" min={0} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="reorderLevel" label="Low Stock Alert Threshold">
                                    <Input type="number" className="h-10 rounded-md" placeholder="0" min={0} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="expiryDate" label="Product Batch Expiry">
                            <DatePicker className="h-10 rounded-md w-full" style={{ width: "100%" }} />
                        </Form.Item>

                        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
                            <Button className="h-10 rounded-md" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="h-10 rounded-md px-6 font-medium shadow-sm"
                                loading={loading}
                            >
                                Save Product Record
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default StockMangement;