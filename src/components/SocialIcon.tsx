export function SocialIcon(props: { social: string }) {
  return (
    <>
      {props.social === "steam" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 256 259"
        >
          <path d="M127.78 0C60.422 0 5.24 52.412 0 119.01l68.724 28.674a35.812 35.812 0 0 1 20.426-6.366c.683 0 1.356.019 2.02.055l30.566-44.709v-.627c0-26.903 21.69-48.796 48.352-48.796 26.664 0 48.354 21.893 48.354 48.796s-21.69 48.805-48.353 48.805c-.37 0-.73-.01-1.098-.018L125.399 176.2a36.6 36.6 0 0 1 .046 1.734c0 20.205-16.284 36.636-36.295 36.636-17.566 0-32.263-12.658-35.584-29.412L4.41 164.65c15.223 54.313 64.673 94.132 123.37 94.132 70.818 0 128.22-57.939 128.22-129.39C256 57.928 198.597.002 127.78.002zM80.353 196.33l-15.749-6.569c2.786 5.868 7.62 10.776 14.033 13.47 13.857 5.831 29.837-.802 35.612-14.798a27.555 27.555 0 0 0 .046-21.035c-2.768-6.79-7.999-12.086-14.706-14.909-6.67-2.795-13.81-2.694-20.085-.304l16.274 6.79c10.222 4.3 15.057 16.145 10.794 26.46-4.253 10.315-15.998 15.195-26.22 10.896zm121.96-100.29c0-17.926-14.457-32.521-32.217-32.521-17.769 0-32.226 14.595-32.226 32.521 0 17.926 14.457 32.512 32.226 32.512 17.76 0 32.217-14.586 32.217-32.512zm-56.37-.055c0-13.488 10.84-24.421 24.2-24.421 13.368 0 24.209 10.933 24.209 24.42 0 13.489-10.84 24.422-24.209 24.422-13.359 0-24.2-10.933-24.2-24.421z" />
        </svg>
      )}

      {props.social.toLowerCase() === "github" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96">
          <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
        </svg>
      )}

      {props.social.toLowerCase() === "twitter" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248 204">
          <path d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07a50.338 50.338 0 0 0 22.8-.87C27.8 117.2 10.85 96.5 10.85 72.46v-.64a50.18 50.18 0 0 0 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71a143.333 143.333 0 0 0 104.08 52.76 50.532 50.532 0 0 1 14.61-48.25c20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26a50.69 50.69 0 0 1-22.2 27.93c10.01-1.18 19.79-3.86 29-7.95a102.594 102.594 0 0 1-25.2 26.16z" />
        </svg>
      )}

      {props.social.toLowerCase() === "instagram" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      )}

      {props.social.toLowerCase() === "youtube" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 159 110">
          <path d="M75.451.432C52.323.505 29.312 1.482 18.199 3.8 11.469 5.62 6.2 10.87 4.4 17.6.32 35.5.01 74.2 4.5 92.5c1.82 6.73 7.07 12 13.8 13.8 17.9 4.12 103 4.7 122 0 6.73-1.82 12-7.07 13.8-13.8 4.35-19.5 4.66-55.8-.1-75-1.82-6.73-7.07-12.001-13.801-13.801C135.114 1.736 105.186.337 75.451.43zM64.199 31.6 105 55 64.199 78.4V31.599z" />
        </svg>
      )}

      {props.social.toLowerCase() === "twitch" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111.79 127.39">
          <path d="m101.39 67.589-18.202 18.2H54.595l-15.598 15.596V85.79H15.6V10.4h85.79zM5.198.001-.001 20.8v93.584h23.4v13h12.994l13.002-13H70.19l41.594-41.588V0z" />
          <path d="M44.197 62.394h10.399V31.193H44.197zm28.595 0h10.399V31.193H72.792z" />
        </svg>
      )}

      {props.social.toLowerCase() === "discord" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
          <path
            d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"
            data-name="Discord Logo - Large - White"
          />
        </svg>
      )}

      {props.social.toLowerCase() === "tiktok" && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
        </svg>
      )}
    </>
  );
}