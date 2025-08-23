// import { ReactNode, useEffect, useState } from "react";
// import GFIcon from "./GFIcon";
// // import Button from "./Button";

// export default function Select(props: {
//   id: string;
//   label: string;
//   name?: string;
//   value?: string | number;
//   options: {
//     icon: string | ReactNode;
//     value: string | number;
//     label: string;
//   }[];
//   onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   disabled?: boolean;
// }) {
//   const [showOptions, setShowOptions] = useState(false);
//   const [selectedValue, setSelectedValue] = useState<string | number>(
//     props.value || ""
//   );

//   useEffect(() => {
//     const list = document.getElementById("select-" + props.id);

//     if (!list) return;

//     const handleClickOutside = (event: MouseEvent) => {
//       if (list && !list.contains(event.target as Node)) {
//         setShowOptions(false);
//       }
//     };


//     list.addEventListener("keydown", (event) => {
//       if (event.key === "Escape") {
//         setShowOptions(false);
//       } else if (event.key === "Enter") {
//         const selectedOption = props.options.find(
//           (option) => option.value === selectedValue
//         );
//         if (selectedOption && props.onChange) {
//           props.onChange({
//             target: { value: selectedOption.value },
//           } as React.ChangeEvent<HTMLSelectElement>);
//         }
//         setShowOptions(false);
//       }
//     });

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [props.id]);

//   return (
//     <div className="select-container">
//       <label htmlFor={props.id} className="select-label">
//         {props.label}
//       </label>
//       <button
//         id={"dropdown-button"}
//         className="select-button"
//         type="button"
//         aria-haspopup="listbox"
//         aria-expanded={showOptions}
//         onClick={() => setShowOptions(!showOptions)}
//         disabled={props.disabled}
//       >
//         <GFIcon className="select-icon">
//           {props.options.find((option) => option.value === props.value)?.icon}
//         </GFIcon>
//         <span className="select-value">
//           {props.options.find((option) => option.value === props.value)?.label}
//         </span>
//         <GFIcon className="select-chevron">chevron-down</GFIcon>
//       </button>
//       <ul
//         id={"select-" + props.id}
//         className="select-input"
//         role="listbox"
//         aria-labelledby="dropdown-button"
//       >
//         {props.options.map((option) => (
//           <li
//             key={option.value}
//             value={option.value}
//             onClick={() => {
//               if (props.onChange) {
//                 props.onChange({
//                   target: { value: option.value },
//                 } as React.ChangeEvent<HTMLSelectElement>);
//               }
//             }}
//           >
//             <GFIcon>{option?.icon}</GFIcon>
//             <span className="select-value">{option?.label}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
