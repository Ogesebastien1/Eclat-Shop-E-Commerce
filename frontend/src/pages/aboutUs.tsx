import { Card, Tab, Tabs } from "@nextui-org/react";
import MyNavbar from "../components/navbar";
import { AiOutlineProduct } from "react-icons/ai";
import { BsFillClipboard2HeartFill } from "react-icons/bs"
import { CiShop } from "react-icons/ci";

export default function About() {

  return (
    <>
      <MyNavbar /> 
      <div 
        className="flex w-full flex-col"
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "95%",
            marginLeft: "auto",
            marginRight: "15px",
        }}
        >
        <Tabs aria-label="Options" color="primary" variant="bordered" className="grey-tabs">
        <Tab
            key="about"
            title={
            <div className="flex items-center space-x-2">
                 <CiShop />
                <span>About us</span>
            </div>
            }
        >
        <Card style={{ maxWidth: '500px', height: '300px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <p style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>Éclat Shop is a leading online retailer known for our wide range of high-quality products and exceptional customer service. We strive to provide a shopping experience that delights our customers and keeps them coming back for more.</p>
            <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>Developers</p>
            <p style={{textAlign: 'center', marginTop: '20px', textDecoration: 'bold' }}>OGE SEBASTIEN - MENTREL ETIENNE - BRAVO LOÏC  </p> 
        </Card>
        </Tab>
        <Tab
            key="products"
            title={
            <div className="flex items-center space-x-2">
                <AiOutlineProduct />
                <span>Our Products</span>
            </div>
            }
        >
        <Card style={{ maxWidth: '500px', height: '300px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <p style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>At Éclat Shop, we offer a wide range of products to meet all your needs. From fashion and beauty products to home goods and electronics, we have something for everyone. We carefully select our products to ensure they meet our high standards of quality.</p>
            </Card>
        </Tab>
        <Tab
            key="values"
            title={
            <div className="flex items-center space-x-2">
                <BsFillClipboard2HeartFill />
                <span>Our Values</span>
            </div>
            }
        >
        <Card style={{ maxWidth: '510px', height: '300px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <p style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>At Éclat Shop, we believe in providing high-quality products, exceptional customer service, and a seamless online shopping experience. We are committed to sustainability and ethical business practices, and we strive to make a positive impact in our community.</p>
            </Card>
        </Tab>
        </Tabs>
      </div>  
    </>
  );
}