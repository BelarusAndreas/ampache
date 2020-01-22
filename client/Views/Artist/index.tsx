import React, { useContext, useEffect, useState } from 'react';
import { getAlbumsFromArtist } from '../../logic/Artist';
import { User } from '../../logic/User';
import AmpacheError from '../../logic/AmpacheError';
import { Album } from '../../logic/Album';
import AlbumDisplay from '../components/AlbumDisplay';
import { playSongFromAlbum } from '../../Helpers/playAlbumHelper';
import { MusicContext } from '../../Contexts/MusicContext';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';

interface ArtistViewProps {
    user: User;
    match: {
        params: {
            artistID: number;
        };
    };
}

const ArtistView: React.FC<ArtistViewProps> = (props: ArtistViewProps) => {
    const musicContext = useContext(MusicContext);

    const [albums, setAlbums] = useState<Album[]>(null);
    const [error, setError] = useState<Error | AmpacheError>(null);

    useEffect(() => {
        if (props.match.params.artistID != null) {
            getAlbumsFromArtist(props.match.params.artistID, props.user.authKey)
                .then((data) => {
                    setAlbums(data);
                })
                .catch((error) => {
                    toast.error(
                        '😞 Something went wrong getting albums from artist.'
                    );
                    setError(error);
                });
        }
    }, [props.match.params.artistID, props.user.authKey]);

    if (error) {
        return (
            <div className='artistPage'>
                <span>Error: {error.message}</span>
            </div>
        );
    }
    if (!albums) {
        return (
            <div className='artistPage'>
                <ReactLoading color='#FF9D00' type={'bubbles'} />
            </div>
        );
    }
    return (
        <div className='artistPage'>
            <div className='details'>
                {/*<div className='imageContainer'>*/}
                {/*    <img*/}
                {/*        src={this.state.theArtist.art}*/}
                {/*        alt={'Album Cover'}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*Name: {this.state.theArtist.name}*/}
            </div>
            <h1>Albums</h1>
            <div className='albums'>
                {albums.map((theAlbum) => {
                    return (
                        <AlbumDisplay
                            album={theAlbum}
                            playSongFromAlbum={(albumID, random) => {
                                playSongFromAlbum(
                                    theAlbum.id,
                                    random,
                                    props.user.authKey,
                                    musicContext
                                );
                            }}
                            showGoToAlbum={false}
                            key={theAlbum.id}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ArtistView;