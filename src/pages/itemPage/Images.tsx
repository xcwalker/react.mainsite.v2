import { ItemType } from "../../types";
import css from "../../styles/pages/itemPage/images.module.css";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Download, Zoom } from "yet-another-react-lightbox/plugins";
import PhotoAlbum, { Photo } from "react-photo-album";
import GFIcon from "../../components/GFIcon";

export default function ItemImages(props: {
  item: ItemType;
  slug: string;
  itemType: "projects" | "recipes" | "albums" | "blog";
}) {
  const item = props.item;
  const [open, setOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [images, setImages] = useState<Photo[]>([]);

  useEffect(() => {
    if (item.metaData.imageCount === 0) return;

    Array(item.metaData.imageCount)
      .fill(1)
      .map((unused, index) => {
        const string =
          "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" + props.itemType + "/" +
          props.slug.toLowerCase() +
          "/images/image-" +
          index +
          ".jpg";

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
        getMeta(string, (err, img) => {
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
  }, [item.metaData.imageCount, props.slug, props.itemType]);

  return (
    <div className={css.images}>
      <Button onClick={() => setOpen(true)} title="Show Lightbox" style="primary" hidden="pageNavigation" className={css.tabButton}>
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
