const text: string = "import spikeextractors as se\nimport numpy as np\nimport kachery_client as kc\nfrom sortingview import LabboxEphysSortingExtractor, LabboxEphysRecordingExtractor, load_workspace\n\n\n# Adjust these values\nrecording_label = 'despy_tet3'\nsorting_label = 'sorting'\nrecording_nwb_path = '<path or URI of nwb recording>'\nsorting_nwb_path = '<path or URI of nwb sorting>'\nworkspace_uri = '{workspaceUri}'\n\nrecording_uri = kc.store_object({\n    'recording_format': 'nwb',\n    'data': {\n        'path': recording_nwb_path\n    }\n})\nsorting_uri = kc.store_object({\n    'sorting_format': 'nwb',\n    'data': {\n        'path': sorting_nwb_path\n    }\n})\n\nsorting = LabboxEphysSortingExtractor(sorting_uri, samplerate=30000)\nrecording = LabboxEphysRecordingExtractor(recording_uri, download=True)\n\nworkspace = load_workspace(workspace_uri)\nprint(f'Workspace URI: {workspace.uri}')\nR_id = workspace.add_recording(recording=recording, label=recording_label)\nS_id = workspace.add_sorting(sorting=sorting, recording_id=R_id, label=sorting_label)"

export default text