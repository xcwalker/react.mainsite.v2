import { ProjectItem } from "../../types";
import css from "../../styles/pages/project/images.module.css";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Download, Zoom } from "yet-another-react-lightbox/plugins";
import PhotoAlbum from "react-photo-album";

export default function Images(props: { item: ProjectItem }) {
  const item = props.item;
  const [open, setOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [images, setImages] = useState<
    [
      {
        key: number;
        src: string;
        width: number;
        height: number;
      }?
    ]
  >([]);

  useEffect(() => {
    if (item.metaData.imageCount === 0) return;
    
    Array(item.metaData.imageCount)
      .fill(1)
      .map((unused, index) => {
        const string =
          "https://raw.githubusercontent.com/xcwalker/gmod/main/" +
          item.metaData.slug +
          "/" +
          item.metaData.imageDirectory +
          "/promo-" +
          (index + 1) +
          ".jpg";

        const getMeta = (url: string, cb: (err, img?) => {}) => {
          const img = new Image();
          img.onload = () => cb(null, img);
          img.onerror = (err) => cb(err);
          img.src = url;
        };

        // Use like:
        getMeta(string, (err, img) => {
          setImages((prev) => {
            if (prev.some((v) => v.key === index)) return [...prev];
            return [
              ...prev,
              {
                key: index,
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
    item.metaData.imageCount,
    item.metaData.imageDirectory,
    item.metaData.slug,
  ]);

  return (
    <div className={css.images}>
      <Button onClick={() => setOpen(true)} className={css.tabButton}>
        Show Lightbox
      </Button>
      <PhotoAlbum
        layout="rows"
        photos={images}
        targetRowHeight={300}
        breakpoints={[300, 600, 900, 1200, 1500, 1800, 2100]}
        onClick={({ index: current }) => {
          setSlideIndex(current);
          setOpen(true);
        }}
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
