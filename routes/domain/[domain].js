const db = require('../../modules/db');
const dns = require('node:dns');

async function lookup(domain) {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, { family: 4 }, (err, address, family) => {
      if (err) reject(err);
      resolve(address);
    });
  });
}

const get = async (req, res) => {
  let domain = req.params.domain;
  let address
  try {
    address = await lookup(domain);
  } catch (error) {
    res.status(404).json({ message: 'That is not a domain... come on now...' });
    return;
  }

  if (!address.startsWith('192.64.126')) {
    res.status(404).json({ message: `It looks like we don\'t host ${domain}, confirm with Adam. Address:  ${address}` });
    return;
  }

  if (address.endsWith('.252')) {
    res.json({message: `It looks like ${domain} is located on Plesk Host 2`})
    return;
  }
  if (address.endsWith('.254')) {
    res.json({message: `It looks like ${domain} is located on Plesk Host 1`})
    return;
  }
  if (address.endsWith('.173') || address.endsWith('.253')) {
    res.json({message: `It looks like ${domain} is located on Plesk Host 3`})    
    return;
  }
  if (address.endsWith('.74')) {
    res.json({message: `It looks like ${domain} is located on Plesk Host 4`})    
    return;
  }
  if (address.endsWith('.75') || address.endsWith('.247')) {
    res.json({message: `It looks like ${domain} is located on Plesk Host 5`})  
    return;
  }
  res.status(404).json({ message: `It looks like we don\'t host ${domain}, confirm with Adam. Address:  ${address}` });
};

module.exports = {
  get,
};
 