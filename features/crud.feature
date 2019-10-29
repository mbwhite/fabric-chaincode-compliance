# crud.feature

Feature: CRUD Shim APIs

  Background:
    Given The 'first-network' network has been started
    And The required channel has been created
    And The 'crud' chaincode has been deployed

  @put
  Scenario: Should add a key
    Given I can submit a transaction 'org.mynamespace.crud:putKey' with arguments '["newKey1","newValue1"]'
    Then I can confirm the simple key 'newKey1' has value 'newValue1'

  @put
  Scenario: Should add a composite key
    Given I can a transaction 'putKey' with arguments '["tim","green","newCompositeValue"]'
    Then I can confirm the composite key 'tim:green' has value 'newCompositeValue'

  @put
  Scenario: Should update an existing key
    Given I can submit a transaction 'putKey' with arguments '["newKey1","updatedValue1"]'
    Then I can confirm the simple key 'newKey1' has value 'updatedValue1'