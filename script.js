document.addEventListener("DOMContentLoaded", function () {
  // Loop through all the components
  document
    .querySelectorAll('[dropdown-custom="component"]')
    .forEach(function (component) {
      const input = component.querySelector('[dropdown-custom="input"]');
      const toggle = component.querySelector('[dropdown-custom="toggle"]');
      const list = component.querySelector('[dropdown-custom="list"]');
      const arrow = component.querySelector('[dropdown-custom="arrow"]');
      const clear = component.querySelector('[dropdown-custom="clear"]');
      const optionsList = component.querySelector(
        '[dropdown-custom="options-list"]'
      );
      const empty = component.querySelector('[dropdown-custom="empty"]');
      const select = component.querySelector("select");

      function populateOptions() {
        // Clear existing options but keep the empty state element
        optionsList
          .querySelectorAll('[dropdown-custom="option"]')
          .forEach(function (option) {
            option.remove();
          });

        // Populate options from the select field
        let hasOptions = false;
        select.querySelectorAll("option").forEach(function (option) {
          const optionItem = document.createElement("div");
          optionItem.textContent = option.textContent;
          optionItem.classList.add("dropdown-option");
          optionItem.setAttribute("dropdown-custom", "option");

          // Set active class if the option is selected
          if (option.selected) {
            optionItem.classList.add("option-active");
            input.value = option.textContent;
          }

          // Add click event listener to update input and select values
          optionItem.addEventListener("click", function () {
            input.value = option.textContent;
            select.value = option.value;
            clear.style.display = "block";
            arrow.style.display = "none";
            input.blur();

            // Update active class on options
            optionsList
              .querySelectorAll('[dropdown-custom="option"]')
              .forEach(function (opt) {
                opt.classList.remove("option-active");
              });
            optionItem.classList.add("option-active");
          });

          optionsList.appendChild(optionItem);
          hasOptions = true;
        });

        // Show or hide the empty state based on whether there are options
        empty.style.display = hasOptions ? "none" : "block";
      }

      function toggleDropdown(open) {
        if (
          open &&
          !toggle.classList.contains("dropdown-open") &&
          !list.classList.contains("dropdown-open")
        ) {
          toggle.classList.add("dropdown-open");
          list.classList.add("dropdown-open");
        } else if (
          !open &&
          toggle.classList.contains("dropdown-open") &&
          list.classList.contains("dropdown-open")
        ) {
          toggle.classList.remove("dropdown-open");
          list.classList.remove("dropdown-open");
        }
      }

      // Add focus and blur event listeners to the input
      input.addEventListener("focus", function () {
        toggleDropdown(true);
      });

      input.addEventListener("blur", function () {
        setTimeout(function () {
          // Delay to ensure click event is processed
          if (!component.contains(document.activeElement)) {
            toggleDropdown(false);
            // Clear input if no option is selected
            if (!select.value) {
              input.value = "";
            }
          }
        }, 100);
      });

      // Add click event listener to the arrow
      arrow.addEventListener("click", function () {
        if (document.activeElement !== input) {
          input.focus();
        }
      });

      // Add input event listener to show/hide the clear button and arrow
      input.addEventListener("input", function () {
        const trimmedValue = input.value.trim(); // Trim input value to ignore extra spaces

        if (trimmedValue !== "") {
          clear.style.display = "block";
          arrow.style.display = "none";
        } else {
          clear.style.display = "none";
          arrow.style.display = "block";
        }

        // Filter options based on trimmed input
        const filter = trimmedValue.toLowerCase();
        let hasVisibleOptions = false;

        optionsList
          .querySelectorAll('[dropdown-custom="option"]')
          .forEach(function (opt) {
            const text = opt.textContent.toLowerCase();
            if (text.includes(filter)) {
              opt.style.display = "";
              hasVisibleOptions = true;
            } else {
              opt.style.display = "none";
            }
          });

        // Show or hide the empty state based on whether there are visible options
        empty.style.display = hasVisibleOptions ? "none" : "block";
      });

      // Add click event listener to the clear button
      clear.addEventListener("click", function () {
        input.value = "";
        select.value = "";
        input.focus();
        clear.style.display = "none";
        arrow.style.display = "block";
        optionsList
          .querySelectorAll('[dropdown-custom="option"]')
          .forEach(function (opt) {
            opt.style.display = "";
            opt.classList.remove("option-active");
          });
        empty.style.display = "none"; // Hide empty state when clearing input
      });

      // Handle Enter key press
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent form submission
          const trimmedValue = input.value.trim().toLowerCase();
          let matchedOption = null;

          optionsList
            .querySelectorAll('[dropdown-custom="option"]')
            .forEach(function (opt) {
              if (opt.textContent.toLowerCase() === trimmedValue) {
                matchedOption = opt;
              }
            });

          if (matchedOption) {
            matchedOption.click(); // Select the matched option
          } else {
            input.value = ""; // Clear input if no match
          }
        }
      });

      // Initial population of options
      populateOptions();

      // Observe changes in the select field
      const observer = new MutationObserver(function (mutationsList) {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList" || mutation.type === "attributes") {
            populateOptions();
          }
        }
      });

      observer.observe(select, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      // Initial check to show/hide clear button and arrow based on input value
      const initialValue = input.value.trim();
      if (initialValue !== "") {
        clear.style.display = "block";
        arrow.style.display = "none";
      } else {
        clear.style.display = "none";
        arrow.style.display = "block";
      }

      // Ensure the text input is not submitted with the form
      input.removeAttribute("name");
    });
});