import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPadding, setMargin } from '../app/features/resumeSlice';

const PaddingMarginControls = () => {
    const dispatch = useDispatch();
    const { padding, margin } = useSelector(state => state.resume);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Formatting</h3>
            <div className="flex flex-col space-y-2">
                <div>
                    <label htmlFor="padding" className="block text-sm font-medium">Padding</label>
                    <input
                        type="text"
                        id="padding"
                        value={padding}
                        onChange={(e) => dispatch(setPadding(e.target.value))}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="margin" className="block text-sm font-medium">Margin</label>
                    <input
                        type="text"
                        id="margin"
                        value={margin}
                        onChange={(e) => dispatch(setMargin(e.target.value))}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default PaddingMarginControls;
