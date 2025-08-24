import { AlbumItemProps } from "../../types";
import css from "../../styles/pages/project/images.module.css";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Download, Zoom } from "yet-another-react-lightbox/plugins";
import PhotoAlbum, { Photo } from "react-photo-album";
import GFIcon from "../../components/GFIcon";

export default function AlbumImages(props: { item: AlbumItemProps; slug: string }) {
  const item = props.item;
  const [open, setOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [images, setImages] = useState<Photo[]>([]);

  useEffect(() => {
    if (item.metaData.images === undefined || item.metaData.images.length === 0)
      return;

    item.metaData.images.map((url, index) => {
      const string = url;

      const getMeta = (
        url: string,
        cb: (err: string | Event | null, img?: HTMLImageElement) => void
      ) => {
        const img = new Image();
        img.onload = () => cb(null, img);
        img.onerror = (err) => cb(err);
        img.src = url;
      };

      // Use like:
      getMeta(string, (_err, img) => {
        setImages((prev) => {
          if (prev.some((v) => v.key === index.toString())) return [...prev];
          return [
            ...prev,
            {
              key: index.toString(),
              src: string,
              height: img ? img.naturalHeight : 0,
              width: img ? img.naturalWidth : 0,
            },
          ];
        });
      });
    });

    return () => {
      setImages([]);
    };
  }, [
    item.metaData.images,
    props.slug,
  ]);

  return (
    <div className={css.images}>
      <Button onClick={() => setOpen(true)} className={css.tabButton} title="Show Lightbox">
        Show Lightbox
      </Button>
      <PhotoAlbum
        layout="rows"
        photos={images}
        targetRowHeight={200}
        breakpoints={[300, 600, 900, 1200, 1500, 1800, 2100]}
        onClick={({ index: current }) => {
          setSlideIndex(current);
          setOpen(true);
        }}
        renderPhoto={({ wrapperStyle, renderDefaultPhoto }) => (
          <div style={wrapperStyle} className={css.image}>
            <GFIcon className={css.icon}>fullscreen</GFIcon>
            {renderDefaultPhoto({ wrapped: true })}
          </div>
        )}
      />
      <Lightbox
        open={open}
        index={slideIndex}
        close={() => setOpen(false)}
        slides={images}
        plugins={[Download, Zoom]}
      />
    </div>
  );
}
