import React, { useState } from "react";
import "./App.css";

function App() {
  const [formJSON, setFormJSON] = useState([]);
  const [currentElementType, setCurrentElementType] = useState("");
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedForm, setSubmittedForm] = useState({});

  const handleElementClick = (event) => {
    setCurrentElementType(event.target.value);
    setLabel("");
  };

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handleDelete = (index) => {
    setFormJSON((prevFormJSON) => prevFormJSON.filter((_, i) => i !== index));
  };

  function alreadyPresent(currentElement) {
    const matchingFormElement = formJSON.find(
      (formElement) =>
        formElement.type === currentElement.type &&
        formElement.label === currentElement.label
    );

    if (!matchingFormElement) {
      return false;
    }

    if (currentElement.type === "dropdown") {
      const missingOptions = currentElement.options.filter(
        (option) => !matchingFormElement.options.includes(option)
      );

      return missingOptions.length === 0;
    }

    return true;
  }

  if (isSaved) {
    const renderElement = (item) => {
      const handleChange = (e) => {
        const value = e.target.value;
        setSubmittedForm({
          ...submittedForm,
          [item.label]: value,
        });
      };

      if (item.name === "file_type") {
        return (
          <div>
            <span>{item.label}</span>
            <input type={item.type} onChange={handleChange} />
          </div>
        );
      }

      if (item.name === "dropdown_type") {
        return (
          <div>
            <span>{item.label}</span>
            <select onChange={handleChange}>
              {item.options.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </select>
          </div>
        );
      }

      if (item.name === "text_type") {
        return (
          <div>
            <span>{item.label}</span>
            <input type={item.type} onChange={handleChange} />
          </div>
        );
      }

      return null;
    };

    const renderSubmittedForm = () => {
      return (
        <div>
          <h1>Submitted Form</h1>
          {Object.entries(submittedForm).map(([key, value], index) => (
            <div className="submmitted-form-elements" key={index}>
              <span>{key}</span>
              <span>{value}</span>
            </div>
          ))}
          <div>
            <button
              onClick={() => {
                setFormJSON([]);
                setCurrentElementType("");
                setLabel("");
                setOptions([]);
                setCurrentOption("");
                setIsSaved(false);
                setIsSubmitted(false);
                setSubmittedForm({});
              }}
            >
              Create New Form
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="currentForm">
        <h1>Form</h1>
        {formJSON.map((item, index) => (
          <div className="element" key={index}>
            {renderElement(item)}
          </div>
        ))}

        {!isSubmitted && (
          <button onClick={() => setIsSubmitted(true)}>Submit</button>
        )}

        {isSubmitted && renderSubmittedForm()}
      </div>
    );
  }

  return (
    <div className="App">
      <section className="addElementsSection">
        <h1>Create Your Form</h1>
        <label htmlFor="elementSelect">Add Input:</label>
        <select id="elementSelect" onChange={handleElementClick}>
          <option value="">Choose an input type</option>
          <option value="file_type">File</option>
          <option value="dropdown_type">Dropdown</option>
          <option value="text_type">Text</option>
        </select>

        {currentElementType === "file_type" && (
          <div>
            <h3>File Type</h3>
            <input
              type="text"
              value={label}
              placeholder="Enter Label"
              onChange={handleLabelChange}
            />
            <button
              onClick={() => {
                if (label === "") {
                  alert("Label cannot be empty!");
                  return;
                }

                const currentElement = {
                  type: "file",
                  name: "file_type",
                  label,
                };

                if (alreadyPresent(currentElement)) {
                  alert("Element already present!");
                  setLabel("");
                  return;
                }

                setFormJSON([...formJSON, currentElement]);
                setCurrentElementType("");
                setLabel("");
              }}
            >
              Add
            </button>
          </div>
        )}

        {currentElementType === "dropdown_type" && (
          <div>
            <h3>Dropdown Type</h3>
            <input
              type="text"
              value={label}
              placeholder="Enter Label"
              onChange={handleLabelChange}
            />
            <input
              type="text"
              value={currentOption}
              placeholder="Enter Options"
              onChange={(e) => {
                setCurrentOption(e.target.value);
              }}
            />
            <button
              onClick={() => {
                if (currentOption === "") {
                  alert("Option cannot be empty!");
                  return;
                }

                // handle error: if currentOption is already in options, then don't add it
                if (options.includes(currentOption)) {
                  alert("Option already present!");
                  setCurrentOption("");
                  return;
                }

                options.push(currentOption);
                setOptions(options);
                setCurrentOption("");
              }}
            >
              Add Option
            </button>
            <button
              onClick={() => {
                if (label === "") {
                  alert("Label cannot be empty!");
                  return;
                }
                if (options.length === 0) {
                  alert("Options cannot be empty!");
                  return;
                }

                const currentElement = {
                  type: "dropdown",
                  name: "dropdown_type",
                  label,
                  options,
                };

                // handle error: if currentElement is already in formJSON, then don't add it
                if (alreadyPresent(currentElement)) {
                  alert("Element already present!");
                  setLabel("");
                  setOptions([]);
                  return;
                }

                setFormJSON([...formJSON, currentElement]);
                setOptions([]);
                setCurrentOption("");
                setLabel("");
              }}
            >
              Add
            </button>
          </div>
        )}
        {currentElementType === "text_type" && (
          <div>
            <h3>Text Type</h3>
            <input
              type="text"
              value={label}
              placeholder="Enter Label"
              onChange={handleLabelChange}
            />
            <button
              onClick={() => {
                if (label === "") {
                  alert("Give a Label");
                  return;
                }

                const currentElement = {
                  type: "text",
                  name: "text_type",
                  label,
                };

                if (alreadyPresent(currentElement)) {
                  alert("Element already present!");
                  setLabel("");
                  return;
                }

                setFormJSON([...formJSON, currentElement]);
                setCurrentElementType("");
                setLabel("");
              }}
            >
              Add
            </button>
          </div>
        )}
      </section>
      <section className="previewSection">
        {formJSON.length === 0 && (
          <div>
            <h1>Your Form!</h1>
          </div>
        )}
        {formJSON.length !== 0 && (
          <div className="box">
            <h1>Form Preview</h1>
            {formJSON.map((item, index) => {
              if (item.name === "file_type") {
                return (
                  <div className="form-verify-element" key={index}>
                    <span>File Type</span>
                    <span>{item.label}</span>
                    <button
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              } else if (item.name === "dropdown_type") {
                return (
                  <div className="form-verify-element" key={index}>
                    <span>Dropdown Type</span>
                    <span>{item.label}</span>
                    <br></br>
                    <span>Options:</span>
                    {item.options.map((option) => {
                      return <span> {option} </span>;
                    })}
                    <br></br>
                    <button
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              } else if (item.name === "text_type") {
                return (
                  <div className="form-verify-element" key={index}>
                    <span>Text Type</span>
                    <span>{item.label}</span>
                    <button
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              }
              return <></>;
            })}
            <button
              onClick={() => {
                setIsSaved(true);
              }}
            >
              Save Form
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
