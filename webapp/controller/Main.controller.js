sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
],

    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("com.demo.romanconverter.controller.Main", {
            onInit: function () {
                let oModel = new JSONModel({
                    RomanNumberList: [],
                    DynamicRomanNumberList: [],
                    rowNumber: "",
                    columnNumber: ""
                });
                // created a main JSON model
                this.getView().setModel(oModel, "main");

                // call function for filling the table
                this.putValues();
            },

            // function for filling the table
            putValues: function () {
                let romanTable = this.getView().getModel("main").getProperty("/RomanNumberList");

                let oObjectStatic = {};

                // looping in rows
                for (let j = 0; j < 100; j++) {
                    // create new object with index j
                    oObjectStatic[j] = {};

                    // loop in columns
                    for (let k = 0; k < 6; k++) {

                        // first two column should be same
                        if(k === 1 || k === 0){
                            oObjectStatic[j]["value" + k] = this.convertToRoman((j + 1) * (1));
                        }else{
                            // rest of columns
                            oObjectStatic[j]["value" + k] = this.convertToRoman((j + 1) * (k));
                        }
                        
                    }
                }

                // assign object to romanTable and set it to main model
                Object.assign(romanTable, oObjectStatic);
                this.getView().getModel("main").setProperty("/RomanNumberList", romanTable);

            },

            // function for converting regular number to roman number
            convertToRoman: function (number) {

                // roman number object
                const romanNumbers = {
                    M: 1000,
                    CM: 900,
                    D: 500,
                    CD: 400,
                    C: 100,
                    XC: 90,
                    L: 50,
                    XL: 40,
                    X: 10,
                    IX: 9,
                    V: 5,
                    IV: 4,
                    I: 1
                };

                //clear roman number value
                let roman = "";

                // loop in object
                for (let key in romanNumbers) {

                    // loop with number in the object to convert, until the number greater or equal
                    while (number >= romanNumbers[key]) {

                        // add key to roman value
                        roman += key;

                        // substract the key value from the number
                        number -= romanNumbers[key];
                    }
                }

                return roman;
            },

            // function for get column and row values
            getInputValues: function () {
                let column = this.getView().getModel("main").getProperty("/columnNumber");
                let row = this.getView().getModel("main").getProperty("/rowNumber");

                //check if they are emty or not
                if (column !== "" && row !== "") {
                    this.createDynamicTable(column, row);
                } else {
                    MessageBox.error("Please enter column and row numbers!");
                }
            },

            // function for creating dynamic table
            createDynamicTable: function (columnNumber, rowNumber) {
                
                // clear model for each click event
                this.getView().getModel("main").setProperty("/DynamicRomanNumberList", []);

                var table = this.byId("dynamicTable");
                // destroy columns
                table.destroyColumns();

                // creating columns with entered number
                for (let i = 0; i < Number(columnNumber) + 1; i++) {
                    if (i === 0) {
                        var oColumn = new sap.m.Column("col" + i, {
                            width: "1em",
                            header: new sap.m.Label({
                                text: ""
                            })
                        });
                        table.addColumn(oColumn);
                    }
                    else {
                        var oColumn = new sap.m.Column("col" + i, {
                            width: "1em",
                            header: new sap.m.Label({
                                text: this.convertToRoman(i)
                            })
                        });
                        table.addColumn(oColumn);
                    }
                }

                let oCell = [];
                let oObject = {};

                // loop in rows
                for (let j = 0; j < Number(rowNumber); j++) {
                    let count = 0;
                    oObject[j] = {};

                    // loop in columns until count equals to column number
                    while (count < table.getColumns().length) {

                        // get column id
                        let colId = table.getColumns()[count].getId();

                        // if block for first two column should be same 
                        if (count === 0 || count === 1) {
                            oObject[j][colId] = this.convertToRoman((j + 1) * (count + 1));
                            oObject[j][colId] = oObject[j]["col0"];
                        } else {
                            // for the rest of columns
                            oObject[j][colId] = this.convertToRoman((j + 1) * (count));
                        }

                        // create cells for table
                        let cell1 = new sap.m.Text({
                            text: "{main>col" + count + "}"
                        });
                        oCell.push(cell1);

                        // increase the counter
                        count++;
                    }
                }

                //}

                // set the object to the model
                this.getView().getModel("main").setProperty("/DynamicRomanNumberList", oObject);

                // binding cells to table
                table.bindItems({
                    path: "main>/DynamicRomanNumberList",
                    template: new sap.m.ColumnListItem("", {
                        cells: oCell
                    }),
                    templateShareable: true,
                });

                table.setVisible(true);
            }
        });
    });
