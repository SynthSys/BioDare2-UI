import {ExperimentalAssayView} from './experimental-assay-view';
import {ContributionDesc} from '../contribution/contribution-desc';

import {ExperimentalDetails} from './experimental-details';
import {ExperimentalFeatures} from './experimental-features';
import {SimpleProvenance} from '../shared/simple-provenance';
import {SecuritySummary} from '../security/security-summary';
import {DataCategory} from '../biodesc/data-category';
import {ExperimentGeneralDescView} from './experiment-general-desc-view';


describe('ExperimentalAssayView', () => {

  const sampleJson = `

{
  "id" : 2,
  "generalDesc" : {
    "name" : "Test experiment",
    "purpose" : "To check code",
    "description" : "A description",
    "comments" : "A commment",
    "executionDate" : [ 2020, 1, 20 ]
  },
  "contributionDesc" : {
    "authors" : [ {
      "id" : 3,
      "login" : "test",
      "firstName" : "Fisttest",
      "lastName" : "Lasttest",
      "ORCID" : null
    } ],
    "curators" : [ {
      "id" : 4,
      "login" : "curator",
      "firstName" : "Fistcurator",
      "lastName" : "Lastcurator",
      "ORCID" : null
    } ],
    "institutions" : [ {
      "id" : 6,
      "name" : "Cambridge",
      "longName" : "University Cambridge",
      "address" : "Cambridge in Edinburgh",
      "web" : "www.Cambridge.ed.ac"
    }, {
      "id" : 7,
      "name" : "Fife",
      "web" : "www.Fife.ed.ac"
    } ],
    "fundings" : [ {
      "institution" : {
        "id" : 5,
        "name" : "UoE",
        "longName" : "University UoE",
        "address" : "UoE in Edinburgh",
        "web" : "www.UoE.ed.ac"
      },
      "grantNr" : "123"
    } ]
  },
  "experimentalDetails" : {
    "measurementDesc" : {
      "technique" : "Luciferase luminescence",
      "equipment" : "Topcount 1",
      "description" : " A description",
      "parameters" : [ {
        "name" : "last",
        "value" : "a value"
      }, {
        "name" : "first",
        "value" : "2",
        "label" : "first param",
        "unit" : "a unit"
      }, {
        "name" : "second",
        "value" : "3",
        "label" : "2n param"
      }, {
        "name" : "empty"
      } ]
    },
    "growthEnvironments" : {
      "environments" : [ {
        "name" : "LL",
        "description" : "Desc"
      }, {
        "name" : "LD",
        "description" : null
      } ]
    },
    "experimentalEnvironments" : {
      "environments" : [ {
        "name" : "LL",
        "description" : "Desc"
      }, {
        "name" : "LD",
        "description" : null
      } ]
    },
    "executionDate" : [ 2016, 10, 5 ]
  },
  "features" : {
    "hasTSData" : false,
    "hasPPAJobs" : false,
    "hasDataFiles" : false
  },
  "provenance" : {
    "created" : [ 2016, 9, 30, 16, 29, 19, 592000000 ],
    "createdBy" : "creator",
    "modified" : [ 2016, 10, 4, 16, 29, 19, 592000000 ],
    "modifiedBy" : "modifier"
  },
  "security" : {
    "canRead" : true,
    "canWrite" : true,
    "isOwner" : true,
    "isSuperOwner" : false
  },
  "species" : "Arabidopsis",
  "dataCategory" : "GEN_IMAGING"
}
`;

  it('correctly deserializes', () => {

    const jsonTxt = sampleJson;

    const jsonObj = JSON.parse(jsonTxt);

    const ans = ExperimentalAssayView.deserialize(jsonObj);
    expect(ans).toBeDefined();

    expect(ans.id).toBe(2);
    expect(ans.generalDesc.constructor).toBe(ExperimentGeneralDescView);
    expect(ans.generalDesc.name).toBe('Test experiment');
    expect(ans.contributionDesc.constructor).toBe(ContributionDesc);
    expect(ans.experimentalDetails.constructor).toBe(ExperimentalDetails);
    expect(ans.features.constructor).toBe(ExperimentalFeatures);
    // expect(ans.bioDescription.constructor).toBe(BiologicalDescription);
    // expect(ans.bioSummary.constructor).toBe(BiologySummary);
    expect(ans.species).toBe('Arabidopsis');
    expect(ans.dataCategory.constructor).toBe(DataCategory);
    expect(ans.dataCategory).toBe(DataCategory.get('GEN_IMAGING'));
    expect(ans.provenance.constructor).toBe(SimpleProvenance);
    expect(ans.security.constructor).toBe(SecuritySummary);


    expect(ans.name).toBe('Test experiment');

  });


  it('correctly serializes', () => {

    const jsonTxt = sampleJson;

    const jsonObj = JSON.parse(jsonTxt);

    const ans = ExperimentalAssayView.deserialize(jsonObj);
    expect(ans).toBeDefined();

    const txt = JSON.stringify(ans);
    if (txt) {
    }
    // console.log('EXP ASSAY\n'+txt);

  });


  it('correctly deserializes draft', () => {
    /* tslint:disable:max-line-length */
    const jsonTxt = `
{"id":0,"generalDesc":{"name":null,"purpose":null,"description":null,"comments":null},"contributionDesc":{"authors":[{"id":5,"login":"user1","firstName":"First","lastName":"User","ORCID":null}],"curators":[],"institutions":[],"fundings":[]},"experimentalDetails":{"measurementDesc":{"technique":null,"equipment":null,"description":null,"parameters":[]},"growthEnvironments":{"environments":[]},"experimentalEnvironments":{"environments":[]},"executionDate":[2016,10,5]},"features":{"hasTSData":false,"hasPPAJobs":false,"hasDataFiles":false},"provenance":{"created":null,"createdBy":null,"modified":null,"modifiedBy":null},"security":{"canRead":true,"canWrite":true,"isOwner":true,"isSuperOwner":false},"species":null,"dataCategory":null}

`;
    /* tslint:enable:max-line-length */
    const jsonObj = JSON.parse(jsonTxt);

    const ans = ExperimentalAssayView.deserialize(jsonObj);
    expect(ans).toBeDefined();

    expect(ans.generalDesc.constructor).toBe(ExperimentGeneralDescView);
    expect(ans.contributionDesc.constructor).toBe(ContributionDesc);
    expect(ans.experimentalDetails.constructor).toBe(ExperimentalDetails);
    expect(ans.features.constructor).toBe(ExperimentalFeatures);
    // expect(ans.bioDescription.constructor).toBe(BiologicalDescription);
    // expect(ans.bioSummary.constructor).toBe(BiologySummary);
    expect(ans.species).toBe(null);
    expect(ans.dataCategory).toBe(null);

    expect(ans.provenance.constructor).toBe(SimpleProvenance);
    expect(ans.security.constructor).toBe(SecuritySummary);

  });

});
