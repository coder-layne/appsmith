const dsl = require("../../../../fixtures/tableNewDsl.json");
const commonlocators = require("../../../../locators/commonlocators.json");
const widgetsPage = require("../../../../locators/Widgets.json");
const testdata = require("../../../../fixtures/testdata.json");

describe("Table Widget new column type - Switch", function() {
  before(() => {
    cy.addDsl(dsl);
  });

  it("Test change column type to Switch and test onchange", function() {
    cy.openPropertyPane("tablewidget");
    // Open column detail to be edited
    cy.editColumn("userName");
    // Changing Column data type from "Plain text" to "Switch"
    cy.changeColumnType("Switch");
    // check cell changed to Switch
    cy.getTableCell("1", "2", ".bp3-switch").then((cell) => {
      expect(cell.length).to.be.equal(1);
    });

    cy.onTableAction(0, "onchange", `{{currentRow.productName}}`);

    // toggle switch from 3rd cell of 2nd row
    cy.get(
      `.t--widget-tablewidget .tbody .td[data-rowindex=1][data-colindex=2] .bp3-switch`,
    ).click({ force: true });
    cy.wait(2000);
    cy.get(commonlocators.toastmsg).contains(
      testdata.TablePagination[1].productName,
    );

    cy.get(
      `.t--widget-tablewidget .tbody .td[data-rowindex=1][data-colindex=2] .bp3-switch input[type="checkbox"]`,
    ).should("be.checked");

    cy.closePropertyPane();
  });

  it("Test add new column and set Default Selected for Switch", function() {
    cy.openPropertyPane("tablewidget");
    // Add new column in the table with name "CustomColumn"
    cy.addColumn("CustomColumn");
    cy.editColumn("customColumn1");
    // Changing Column data type from "Plain text" to "Switch"
    cy.changeColumnType("Switch");
    //Uncheck the disabled checkbox using JS and validate
    cy.get(widgetsPage.toggleDefaultSelected).click({ force: true });
    cy.testJsontext("defaultselected", `{{currentRow.orderAmount > 10}}`);
    cy.wait(2000);

    // column 1 and 2 both are default selected
    cy.get(
      `.t--widget-tablewidget .tbody .td[data-rowindex=1][data-colindex=5] .bp3-switch input[type="checkbox"]`,
    ).should("not.be.checked");
    cy.get(
      `.t--widget-tablewidget .tbody .td[data-rowindex=2][data-colindex=5] .bp3-switch input[type="checkbox"]`,
    ).should("be.checked");
    cy.closePropertyPane();
  });
});