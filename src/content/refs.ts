import type { Ref } from '../ui/Cite'

/**
 * References shared across lessons and the model page. Lesson-specific
 * references live beside each lesson. APA 7: sentence-case article and book
 * titles, title-case journal names.
 */
export const COMMON = {
  hall2025: {
    key: 'hall2025', kind: 'book', authors: 'Hall, J. E., & Hall, M. E.', short: 'Hall & Hall', year: '2025',
    title: 'Guyton and Hall textbook of medical physiology', edition: '15th', publisher: 'Elsevier',
  },
  suga1973: {
    key: 'suga1973', kind: 'article', authors: 'Suga, H., Sagawa, K., & Shoukas, A. A.', short: 'Suga et al.', year: '1973',
    title: 'Load independence of the instantaneous pressure-volume ratio of the canine left ventricle and effects of epinephrine and heart rate on the ratio',
    container: 'Circulation Research', volume: '32', issue: '3', pages: '314–322', doi: '10.1161/01.RES.32.3.314',
  },
  suga1974: {
    key: 'suga1974', kind: 'article', authors: 'Suga, H., & Sagawa, K.', short: 'Suga & Sagawa', year: '1974',
    title: 'Instantaneous pressure-volume relationships and their ratio in the excised, supported canine left ventricle',
    container: 'Circulation Research', volume: '35', issue: '1', pages: '117–126', doi: '10.1161/01.RES.35.1.117',
  },
  sunagawa1983: {
    key: 'sunagawa1983', kind: 'article', authors: 'Sunagawa, K., Maughan, W. L., Burkhoff, D., & Sagawa, K.', short: 'Sunagawa et al.', year: '1983',
    title: 'Left ventricular interaction with arterial load studied in isolated canine ventricle',
    container: 'American Journal of Physiology', volume: '245', issue: '5', pages: 'H773–H780', doi: '10.1152/ajpheart.1983.245.5.H773',
  },
  guyton1955: {
    key: 'guyton1955', kind: 'article', authors: 'Guyton, A. C.', short: 'Guyton', year: '1955',
    title: 'Determination of cardiac output by equating venous return curves with cardiac response curves',
    container: 'Physiological Reviews', volume: '35', issue: '1', pages: '123–129', doi: '10.1152/physrev.1955.35.1.123',
  },
  magder2016: {
    key: 'magder2016', kind: 'article', authors: 'Magder, S.', short: 'Magder', year: '2016',
    title: 'Volume and its relationship to cardiac output and venous return',
    container: 'Critical Care', volume: '20', pages: 'Article 271', doi: '10.1186/s13054-016-1438-7',
  },
  westerhof2009: {
    key: 'westerhof2009', kind: 'article', authors: 'Westerhof, N., Lankhaar, J.-W., & Westerhof, B. E.', short: 'Westerhof et al.', year: '2009',
    title: 'The arterial Windkessel',
    container: 'Medical & Biological Engineering & Computing', volume: '47', issue: '2', pages: '131–141', doi: '10.1007/s11517-008-0359-2',
  },
  ursino1998: {
    key: 'ursino1998', kind: 'article', authors: 'Ursino, M.', short: 'Ursino', year: '1998',
    title: 'Interaction between carotid baroregulation and the pulsating heart: A mathematical model',
    container: 'American Journal of Physiology', volume: '275', issue: '5', pages: 'H1733–H1747', doi: '10.1152/ajpheart.1998.275.5.H1733',
  },
  evans2021: {
    key: 'evans2021', kind: 'article',
    authors: 'Evans, L., Rhodes, A., Alhazzani, W., Antonelli, M., Coopersmith, C. M., French, C., Machado, F. R., Mcintyre, L., Ostermann, M., Prescott, H. C., Schorr, C., Simpson, S., Wiersinga, W. J., Alshamsi, F., Angus, D. C., Arabi, Y., Azevedo, L., Beale, R., Beilman, G., … Levy, M.',
    short: 'Evans et al.', year: '2021',
    title: 'Surviving Sepsis Campaign: International guidelines for management of sepsis and septic shock 2021',
    container: 'Critical Care Medicine', volume: '49', issue: '11', pages: 'e1063–e1143', doi: '10.1097/CCM.0000000000005337',
  },
} satisfies Record<string, Ref>
