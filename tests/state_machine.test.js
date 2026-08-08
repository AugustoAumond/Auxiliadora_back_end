const assert = require("node:assert/strict");
const test = require("node:test");
const {
  RentalProposalMachine,
} = require("../dist/state_machine/state_machine");
const {
  RentalProposalAction,
  RentalProposalStatus,
} = require("../dist/state_machine/states");

test("avança uma proposta pelo fluxo", () => {
  assert.equal(
    RentalProposalMachine.transition(
      RentalProposalStatus.NOVA,
      RentalProposalAction.AVANCAR,
    ),
    RentalProposalStatus.ANALISE_CREDITO,
  );
});

test("não retrocede uma proposta nova", () => {
  assert.throws(() =>
    RentalProposalMachine.transition(
      RentalProposalStatus.NOVA,
      RentalProposalAction.RETROCEDER,
    ),
  );
});

test("não permite transições após estado final", () => {
  assert.throws(() =>
    RentalProposalMachine.transition(
      RentalProposalStatus.ATIVO,
      RentalProposalAction.RETROCEDER,
    ),
  );
  assert.throws(() =>
    RentalProposalMachine.transition(
      RentalProposalStatus.CANCELADA,
      RentalProposalAction.REPROVAR,
    ),
  );
});
