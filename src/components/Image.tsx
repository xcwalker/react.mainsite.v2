import css from "../styles/components/image.module.css"

export default function Image(props: {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={css.thumbnail + " " + (props.className ? props.className : "")}>
        <picture className={css.image}>
          <img
            src={props.src
            }
            className={css.thumbnail}
            alt={props.alt}
          />
          <div className={css.thumbnail + " " + css.placeholder}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180.12 139.79">
              <g
                paintOrder="fill markers stroke"
                transform="translate(-13.59 -66.639)"
              >
                <path fill="#d0d0d0" d="M13.591 66.639h180.12v139.79H13.591z" />
                <path
                  fill="#fff"
                  d="m118.51 133.51-34.249 34.249-15.968-15.968-41.938 41.937h152.37z"
                  opacity={0.675}
                />
                <circle
                  cx={58.217}
                  cy={108.56}
                  r={11.773}
                  fill="#fff"
                  opacity={0.675}
                />
                <path fill="none" d="M26.111 77.634h152.61v116.1H26.111z" />
              </g>
            </svg>
          </div>
          {props.children}
        </picture>
      </div>
  );
}