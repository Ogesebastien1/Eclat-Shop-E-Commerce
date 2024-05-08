import { Card, Tab, Tabs } from "@nextui-org/react";
import MyNavbar from "../components/navbar";


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
          marginLeft: "20px",
        }}
      >
        <Tabs aria-label="Options" color="primary" variant="bordered">
          <Tab
            key="photos"
            title={
              <div className="flex items-center space-x-2">
                {/* <GalleryIcon/> */}
                <span>Photos</span>
              </div>
            }
          >
           <Card style={{ maxWidth: '500px', height: '500px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <p style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>We are passionate about photography and have a wide range of experience in different types of photography ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss..</p>
            </Card>
          </Tab>
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                {/* <MusicIcon/> */}
                <span>Music</span>
              </div>
            }
          >
            <Card style={{ maxWidth: '500px', height: '500px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
              <p style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>We love music and have been involved in various music projects over the years.</p>
            </Card>
          </Tab>
          <Tab
            key="videos"
            title={
              <div className="flex items-center space-x-2">
                {/* <VideoIcon/> */}
                <span>Videos</span>
              </div>
            }
          >
            <Card style={{ maxWidth: '500px', height: '500px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
              <p style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>We have a passion for creating engaging and creative videos.</p>
            </Card>
          </Tab>
        </Tabs>
      </div>  
    </>
  );
}