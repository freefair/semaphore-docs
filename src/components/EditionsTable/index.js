import React from 'react';
import Link from '@docusaurus/Link';
import {features} from '@site/src/data/editions';

/**
 * Retain upstream feature names while describing the shipped fork capability set.
 */
export default function EditionsTable() {
  const unsupported = new Set(['aws-secrets-manager', 'devolutions-storage']);
  const rows = [...features].sort(
    (a, b) => a.name.localeCompare(b.name),
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Availability</th>
          <th>Since</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((f) => (
          <tr key={f.key}>
            <td>{f.doc ? <Link to={f.doc}>{f.name}</Link> : f.name}</td>
            <td>{unsupported.has(f.key) ? 'Not implemented' : 'Included'}</td>
            <td>{f.since ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
