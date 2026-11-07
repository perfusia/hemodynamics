import type { Ref } from '../../ui/Cite'
import { COMMON } from '../../content/refs'

const L5 = {
  overgaard2008: {
    key: 'overgaard2008', kind: 'article', authors: 'Overgaard, C. B., & Dzavík, V.', short: 'Overgaard & Dzavík', year: '2008',
    title: 'Inotropes and vasopressors: Review of physiology and clinical use in cardiovascular disease',
    container: 'Circulation', volume: '118', issue: '10', pages: '1047–1056', doi: '10.1161/CIRCULATIONAHA.107.728840',
  },
  hollenberg2011: {
    key: 'hollenberg2011', kind: 'article', authors: 'Hollenberg, S. M.', short: 'Hollenberg', year: '2011',
    title: 'Vasoactive drugs in circulatory shock',
    container: 'American Journal of Respiratory and Critical Care Medicine', volume: '183', issue: '7', pages: '847–855', doi: '10.1164/rccm.201006-0972CI',
  },
  bangash2012: {
    key: 'bangash2012', kind: 'article', authors: 'Bangash, M. N., Kong, M.-L., & Pearse, R. M.', short: 'Bangash et al.', year: '2012',
    title: 'Use of inotropes and vasopressor agents in critically ill patients',
    container: 'British Journal of Pharmacology', volume: '165', issue: '7', pages: '2015–2033', doi: '10.1111/j.1476-5381.2011.01588.x',
  },
  debacker2010: {
    key: 'debacker2010', kind: 'article',
    authors: 'De Backer, D., Biston, P., Devriendt, J., Madl, C., Chochrad, D., Aldecoa, C., Brasseur, A., Defrance, P., Gottignies, P., & Vincent, J.-L.',
    short: 'De Backer et al.', year: '2010',
    title: 'Comparison of dopamine and norepinephrine in the treatment of shock',
    container: 'New England Journal of Medicine', volume: '362', issue: '9', pages: '779–789', doi: '10.1056/NEJMoa0907118',
  },
  russell2008: {
    key: 'russell2008', kind: 'article',
    authors: 'Russell, J. A., Walley, K. R., Singer, J., Gordon, A. C., Hébert, P. C., Cooper, D. J., Holmes, C. L., Mehta, S., Granton, J. T., Storms, M. M., Cook, D. J., Presneill, J. J., & Ayers, D.',
    short: 'Russell et al.', year: '2008',
    title: 'Vasopressin versus norepinephrine infusion in patients with septic shock',
    container: 'New England Journal of Medicine', volume: '358', issue: '9', pages: '877–887', doi: '10.1056/NEJMoa067373',
  },
  khanna2017: {
    key: 'khanna2017', kind: 'article',
    authors: 'Khanna, A., English, S. W., Wang, X. S., Ham, K., Tumlin, J., Szerlip, H., Busse, L. W., Altaweel, L., Albertson, T. E., Mackey, C., McCurdy, M. T., Boldt, D. W., Chock, S., Young, P. J., Krell, K., Wunderink, R. G., Ostermann, M., Murugan, R., Gong, M. N., … Chawla, L. S.',
    short: 'Khanna et al.', year: '2017',
    title: 'Angiotensin II for the treatment of vasodilatory shock',
    container: 'New England Journal of Medicine', volume: '377', issue: '5', pages: '419–430', doi: '10.1056/NEJMoa1704154',
  },
  flood2015: {
    key: 'flood2015', kind: 'book', authors: 'Flood, P., Rathmell, J. P., & Shafer, S.', short: 'Flood et al.', year: '2015',
    title: "Stoelting's pharmacology and physiology in anesthetic practice", edition: '5th', publisher: 'Wolters Kluwer',
  },
  brunton2018: {
    key: 'brunton2018', kind: 'book', authors: 'Brunton, L. L., Hilal-Dandan, R., & Knollmann, B. C. (Eds.).', short: 'Brunton et al.', year: '2018',
    title: "Goodman & Gilman's the pharmacological basis of therapeutics", edition: '13th', publisher: 'McGraw-Hill Education',
  },
} satisfies Record<string, Ref>

export const R5 = { ...COMMON, ...L5 }

export const L5_REFS: Ref[] = [
  R5.overgaard2008, R5.hollenberg2011, R5.bangash2012, R5.debacker2010, R5.russell2008, R5.khanna2017,
  R5.flood2015, R5.brunton2018, R5.hall2025,
]
