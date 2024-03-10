import React, { useEffect, useState } from 'react';
import 'flowbite-react'

export type Root = Root2[][]

export interface Root2 {
  project_name: string;
  id: number
  project_id: number
  action_name: string
  target_id?: number
  target_iid?: number
  target_type?: string
  author_id: number
  target_title?: string
  created_at: string
  author: Author
  push_data?: PushData
  author_username: string
  note?: Note
}

export interface Author {
  id: number
  username: string
  name: string
  state: string
  locked: boolean
  avatar_url: string
  web_url: string
}

export interface PushData {
  commit_count: number
  action: string
  ref_type: string
  commit_from?: string
  commit_to?: string
  ref: string
  commit_title?: string
  ref_count: any
}

export interface Note {
  id: number
  type: any
  body: string
  attachment: any
  author: Author2
  created_at: string
  updated_at: string
  system: boolean
  noteable_id: number
  noteable_type: string
  project_id: number
  resolvable: boolean
  confidential: boolean
  internal: boolean
  noteable_iid: number
  commands_changes: CommandsChanges
}

export interface Author2 {
  id: number
  username: string
  name: string
  state: string
  locked: boolean
  avatar_url: string
  web_url: string
}

export interface CommandsChanges {}


async function fetchProjectNames(projectIds: number[]): Promise<{ [key: number]: string }> {
    return fetch(`http://localhost:8080/project-details?ids=${projectIds.join(',')}`)
        .then(response => response.json());
}

export default function Card() {
    const [data, setData] = useState<Root2[]>([]);
    const [sortOrder, setSortOrder] = useState<'mostRecent' | 'mostAncient'>('mostRecent');

    useEffect(() => {
        fetch('http://127.0.0.1:8080/projectslogs/')
            .then(response => response.json())
            .then((fetchedData: Root) => {
                const flattenedData = fetchedData.flat();
                const projectIds = flattenedData.map(item => item.project_id);
                fetchProjectNames(projectIds)
                    .then(projectNames => {
                        flattenedData.forEach(item => {
                            item.project_name = projectNames[item.project_id];
                        });
                        flattenedData.forEach(item => console.log(item.project_name));
                    });
                setData(shuffleAndSortData(flattenedData));
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }, []);

    const shuffleAndSortData = (data: Root2[]): Root2[] => {
        for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];
        }
        return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortOrder = event.target.value as 'mostRecent' | 'mostAncient';
        setSortOrder(newSortOrder);
        setData(sortData([...data]));
    };

    const sortData = (data: Root2[]): Root2[] => {
        return data.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'mostRecent' ? dateB - dateA : dateA - dateB;
        });
    };

return (
    <div>
        <div style={{ marginTop: '20px' }}>
            <label htmlFor="sortOrder" style={{ marginRight: '10px' }}>Trier par: </label>
            <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
                <option value="mostRecent">Le plus ancien</option>
                <option value="mostAncient">Le plus récent</option>
            </select>
        </div>
        {data.length > 0 ? data.map((item, index) => (
            <div key={index} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mr-auto ml-auto">
                {item.author?.avatar_url && (
                    <div className="image-frame">
                        <img src={item.author.avatar_url} alt="Avatar" />
                    </div>
                )}                
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Author Name: {item.author?.name || 'Inconnu'}</h5>
                <h1 className="font-normal text-gray-700 dark:text-gray-400">Project_id-Name: {item.project_name || 'Inconnu'}</h1>
                <p className="font-normal text-gray-700 dark:text-gray-400">Activity: {item.push_data?.action || 'Inconnu'}</p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Created at: {item.created_at || 'Inconnu'}</p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Commit to: {item.push_data?.ref || 'Inconnu'}</p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Commit title: {item.push_data?.commit_title || 'Inconnu'}</p>
            </div>
        )) : <p>Aucune donnée à afficher</p>}
    </div>
);
}