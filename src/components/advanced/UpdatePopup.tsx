import React, { MouseEventHandler, ReactNode, useEffect, useRef, useState } from 'react'
import VersionChecker from '../../VersionChecker';
import { usePopup } from '../../hooks';
import { Popup } from './Popup';

interface IParagraph{
    title: string
    content: string
    key?: React.Key
}

interface IList{
    title: string
    content: string[]
    key?: React.Key
}

interface IVideoPlayer{
    thumbnail: string
    url: string
    key?: React.Key
}

const VideoPlayer = ({thumbnail, url}:IVideoPlayer) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const loadVideo = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsVideoPlaying(true);
    }

    return(
        <div className="video-player">
            {
            !isVideoPlaying ? <>
                <img 
                    className="thumbnail-placeholder"
                    src={thumbnail}
                    onClick={loadVideo}
                />
                <div className="play-button"/>
            </> :
            <iframe
                style={
                    {
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: "100%",
                        height: "100%",
                        borderRadius: "15px"
                    }
                }
                src={`${url}?autoplay=1`}
                title="video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
            }
        </div>
        
    )
}

const Paragraph = ({title, content}:IParagraph) => {
    return(
        <>
            {title && <h2>{title}</h2>}
            {content && <p>{content}</p>}
        </>
    )
}

const List = ({title, content}:IList) => {
    return(
        <>
            {title && <h2>{title}</h2>}
            {content && 
                <ul>
                    {content.map((element, index) => {
                        return <li key={index}>{element}</li>
                    })}
                </ul>
            }
        </>
    )
}

interface IUpdatePopupContent {
    dataJSON: Object
}

const UpdatePopupContent = ({dataJSON}: IUpdatePopupContent) => {

    const [data, setData] = useState(dataJSON);

    useEffect(() => {
        setData(dataJSON);   
    }, [dataJSON])

    return data ? (
        <>
            {
                data["title"] &&
                <h1>{data["title"]}</h1>
            }
            {
                data["thumbnail"] && 
                <>
                    {
                        (() => {
                            switch(data["thumbnail"]["type"]) {
                                case "image":
                                    return <img src={data["thumbnail"]["url"]}/>
                                    break;
                                case "video":
                                    return <VideoPlayer 
                                        thumbnail={
                                            data["thumbnail"]["thumbnail-url"]
                                        }
                                        url={
                                            data["thumbnail"]["url"]
                                        }
                                    />
                                    break;
                            }
                            return null;
                        })()
                    }
                </>
            }
            {
            data["content"] && data["content"].map((element, index) => {
                switch(element["type"]) {
                    case "paragraph":
                        return <Paragraph 
                            key={index}
                            title={element["title"]}
                            content={element["content"]}
                        />;
                        break;
                    case "list":
                        return <List 
                            key={index}
                            title={element["title"]}
                            content={element["content"]}
                        />;
                        break;
                }
                return <></>;
            })
            }
        </>
    ) : null
}

const PopupContent = () => {
    const [popupContent, setPopupContent] = useState({});
    useEffect(() => {
        const fetchPathNote = async () => {
            setPopupContent(await VersionChecker.getUpdateJSON());
        }
        fetchPathNote();
    }, [])
    return(
        <>
            <UpdatePopupContent dataJSON={popupContent}/>
            <p>View <a href={"https://github.com/NoCymer/nexxt-tabs/releases/tag/V" + VersionChecker.getVersion()} target="_blank">detailed patch note</a> or <a href="https://chrome.google.com/webstore/detail/nexxt-tabs/dbocanalfbkfdbpjpnbjmipaidlogbmi" target="_blank">Leave A Feedback</a></p>
            <footer>
                <p>See us on social medias</p>
                <ul>
                    <li><a href="https://github.com/NoCymer/nexxt-tabs" target="_blank">Github</a></li>
                    <li><a href="https://twitter.com/NEXXT_Tabs" target="_blank">Twitter</a></li>
                    <li><a href="https://discord.gg/x5EbcbrCQG" target="_blank">Discord</a></li>
                </ul>
            </footer>
        </>
    )
}

const UpdatePopup = () => {
    const popupOpener = useRef(null);

    const [isPopupVisible, setIsPopupVisible] = usePopup(
        <Popup
            popupOpenerRef={popupOpener}
            handleClose={() => {setIsPopupVisible(false)}}
            className="update-popup"
        >
            <PopupContent></PopupContent>
        </Popup>
    ,VersionChecker.hasUpdated());
}

export default UpdatePopup