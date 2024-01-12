/*********************************************
 *     BranchifyJS - Interactive Tree        *
 *       with Checkbox Support               *
 *                                           *
 * Author: Tikeswar Sahoo                    *
 * GitHub Repository:                        *
 *   https://github.com/tikeswar/branchifyjs *
 * License: MIT License                      *
 *                                           *
 * Description:                              *
 * Explore an interactive tree structure     *
 * with checkbox support using BranchifyJS.  *
 * This JavaScript library allows you to     *
 * create dynamic trees with collapsible     *
 * nodes, checkboxes, and easy item addition.*
 * Enhance your UI for categorization and    *
 * item management. The code is customizable *
 * and well-documented, making it a versatile*
 * tool for various applications.            *
 *********************************************/
      class BranchifyJS {
        constructor(containerId, treeData) {
          this.container = document.getElementById(containerId);
          this.treeData = treeData;
          this.rootExists = false;
          this.createTree();
        }
      
        createTreeNode(parent, data) {
          const nodeId = "branchify-node-" + Math.random().toString(36).substring(7);
      
          const node = document.createElement("li");
          node.id = nodeId;
          node.classList.add("branchify-node");
      
          const switcher = document.createElement("span");
          switcher.classList.add("branchify-switcher");
          switcher.innerHTML = `
            <svg class="closed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            <svg class="open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M7 14l5-5 5 5z"/>
            </svg>
          `;
          switcher.addEventListener("click", () => this.toggleNode(node));
          node.appendChild(switcher);
      
          const checkbox = document.createElement("span");
          checkbox.classList.add("branchify-checkbox");
          checkbox.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="bi bi-check2">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
            </svg>
          `;
          checkbox.addEventListener("click", (event) => this.toggleCheckbox(event, data));
          checkbox.addEventListener("dblclick", (event) => event.stopPropagation());
          node.appendChild(checkbox);
      
          const label = document.createElement("label");
          label.classList.add("branchify-label");
          label.textContent = data.label;
          label.addEventListener("click", () => this.toggleNode(node));
          node.appendChild(label);
      
          if (data.children) {
            const nodesContainer = document.createElement("ul");
            nodesContainer.classList.add("branchify-nodes", "hidden");
            data.children.forEach((child) => this.createTreeNode(nodesContainer, child));
            node.appendChild(nodesContainer);
          }
      
          parent.appendChild(node);
        }
      
        createTree() {
          if (!this.rootExists) {
            this.createTreeNode(this.container, {
              label: "Root",
              children: this.treeData,
            });
            this.rootExists = true;
          } else {
            const rootNodesContainer = this.container.querySelector(".branchify-nodes");
            rootNodesContainer.innerHTML = "";
            this.treeData.forEach((child) => this.createTreeNode(rootNodesContainer, child));
          }
        }
      
        toggleNode(node) {
          node.classList.toggle("branchify-node__open");
          this.updateParentCheckboxes(node);
          this.updateRootCheckbox();
        }
      
        toggleCheckbox(event, data) {
          event.stopPropagation();
          const checkbox = event.target.closest(".branchify-checkbox");
          checkbox.classList.toggle("branchify-checkbox-checked");
          this.updateChildCheckboxes(checkbox.closest(".branchify-node"), data);
          this.updateParentCheckboxes(checkbox.closest(".branchify-node"));
          this.updateRootCheckbox();
        }
      
        updateChildCheckboxes(node, data) {
          const childCheckboxes = node.querySelectorAll(".branchify-checkbox");
          const isChecked = node.querySelector(".branchify-checkbox").classList.contains("branchify-checkbox-checked");
      
          childCheckboxes.forEach((childCheckbox) => {
            if (isChecked) {
              childCheckbox.classList.add("branchify-checkbox-checked");
            } else {
              childCheckbox.classList.remove("branchify-checkbox-checked");
            }
          });
      
          const childNodes = node.querySelectorAll(".branchify-node");
          childNodes.forEach((childNode) => this.updateChildCheckboxes(childNode, data));
        }
      
        updateParentCheckboxes(node) {
          const parentCheckbox = node.closest(".branchify-node").querySelector(".branchify-checkbox");
          if (!parentCheckbox) return;
      
          const siblingCheckboxes = node.closest(".branchify-nodes").querySelectorAll(".branchify-checkbox");
          const isChecked = Array.from(siblingCheckboxes).every((checkbox) =>
            checkbox.classList.contains("branchify-checkbox-checked")
          );
      
          if (isChecked) {
            parentCheckbox.classList.add("branchify-checkbox-checked");
          } else {
            parentCheckbox.classList.remove("branchify-checkbox-checked");
          }
        }
      
        updateRootCheckbox() {
          const rootCheckbox = this.container.querySelector(".branchify-checkbox");
          const allCheckboxes = this.container.querySelectorAll(".branchify-checkbox");
          const allChecked = Array.from(allCheckboxes).every((checkbox) =>
            checkbox.classList.contains("branchify-checkbox-checked")
          );
          const someChecked = Array.from(allCheckboxes).some((checkbox) =>
            checkbox.classList.contains("branchify-checkbox-checked")
          );
          const noneChecked = !someChecked;
      
          if (allChecked) {
            rootCheckbox.innerHTML = this.getCheckboxIconHtml("bi-check2-all");
          } else if (someChecked) {
            rootCheckbox.innerHTML = this.getCheckboxIconHtml("bi-check2");
          } else {
            rootCheckbox.innerHTML = this.getCheckboxIconHtml("bi-check2");
          }
        }
      
        getCheckboxIconHtml(iconClass) {
          let pathData = "";
      
          if (iconClass === "bi-check2-all") {
            pathData =
              "M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0";
          } else if (iconClass === "bi-check2") {
            pathData =
              "M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0";
          }
      
          return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="${iconClass}">
              <path d="${pathData}"/>
            </svg>
          `;
        }
      }

      const treeData = [
        {
          label: "Category 1",
          children: [
            { label: "Item 1.1" },
            { label: "Item 1.2" },
            { label: "Item 1.3" },
          ],
        },
        {
          label: "Category 2",
          children: [
            { label: "Item 2.1" },
            { label: "Item 2.2" },
            { label: "Item 2.3" },
          ],
        },
        {
          label: "Category 3",
          children: [
            { label: "Item 3.1" },
            { label: "Item 3.2" },
            { label: "Item 3.3" },
          ],
        },
      ];

      const branchifyInstance = new BranchifyJS("branchify", treeData);

      document.getElementById('addCategory').addEventListener('click', function () {
        const categoryName = prompt('Enter category name:');
        if (categoryName) {
          const newCategory = { label: categoryName, children: [] };
          treeData.push(newCategory);
          branchifyInstance.createTree();
        }
      });

      document.getElementById('addItem').addEventListener('click', function () {
        const categoryIndex = prompt('Enter category index to add item:');
        if (categoryIndex !== null) {
          const category = treeData[categoryIndex];
          if (category) {
            const itemName = prompt('Enter item name:');
            if (itemName) {
              const newItem = { label: itemName };
              category.children.push(newItem);
              branchifyInstance.createTree();
            }
          } else {
            alert('Category not found!');
          }
        }
      });
