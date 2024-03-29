/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.chooser.Window
 * @extends Ext.window.Window
 * @author Ed Spencer
 * 
 * This is a simple subclass of the built-in Ext.window.Window class. Although it weighs in at 100+ lines, most of this
 * is just configuration. This Window class uses a border layout and creates a DataView in the central region and an
 * information panel in the east. It also sets up a toolbar to enable sorting and filtering of the items in the 
 * DataView. We add a few simple methods to the class at the bottom, see the comments inline for details.
 */

Ext.define('MyPath.Chooser.Window', {
    extend: 'Ext.panel.Panel',      
	TPanel:'',	 
	mappanel:'',
    //height: 600,
    width : 440,
    title : 'Choose a layer',	
	collapsible:true,			
	//collapsed:true,
    //closeAction: 'hide',	
    //layout: 'border',
	layout:'fit',
    // modal: true,
    border: false,
    bodyBorder: false,
    
    /**
     * initComponent is a great place to put any code that needs to be run when a new instance of a component is
     * created. Here we just specify the items that will go into our Window, plus the Buttons that we want to appear
     * at the bottom. Finally we call the superclass initComponent.
     */
    initComponent: function() {
        this.items = [
            {
                xtype: 'panel',
                region: 'west',
                autoScroll: true,					
                items: [
				{
                    xtype: 'iconbrowser',
                    id: 'img-chooser-view',
                    listeners: {
                        scope: this,
                        selectionchange: this.onIconSelect,
                        itemdblclick: this.fireImageSelected
                    }				
                }				
					
				
				]
            }					
			
        ];      
        
        //this.callParent(arguments);
		this.callParent();        
       
    },   
    /**
     * Called whenever the user clicks on an item in the DataView. 
     */	 
	 
	onIconSelect: function(dataview, selections) {
	
		var me=this;
		var selectedImage = this.down('iconbrowser').selModel.getSelection()[0];
		
		
		
		

		if(this.mappanel.map.getLayersByName('My Location').length > 0) {				
			this.mappanel.map.getLayersByName('My Location')[0].destroy();					
		};	
	
		/** Check if will use user's current location*/				
		if (this.mappanel.dockedItems.items[1].getComponent('rbt1').checked){	
			me=this			
			
			if(this.mappanel.map.getLayersByName('Gcode').length > 0) {				
				this.mappanel.map.getLayersByName('Gcode')[0].destroy();					
			};		
			
			if (navigator.geolocation) {   
				/** Overlay current location*/		
				navigator.geolocation.getCurrentPosition(
					function(position){					
						var currLoc = new OpenLayers.Geometry.Point(position.coords.longitude,position.coords.latitude).transform('EPSG:4326', 'EPSG:900913');
						var Location = new OpenLayers.Layer.Vector(	'My Location', {
								styleMap: new OpenLayers.StyleMap({'default':{
										externalGraphic: "/app/chooser/icons/MyLocation.png",				
										graphicYOffset: -25,
										graphicHeight: 35,
										graphicTitle: "You're here"
								}}) ,
								displayInLayerSwitcher: false,		
								
							});		
						Location.addFeatures([new OpenLayers.Feature.Vector(currLoc)]);						
						me.mappanel.map.addLayers([Location]);						
						me.mappanel.map.zoomToExtent(Location.getDataExtent());		
						}
				)		
				
			} else {
				console.log("Geolocation is not supported by this browser.");
			}
		}
		
		/**
		Load selected layer
		*/	
		var layername = selectedImage.data.name;
		var layer = selectedImage.data.url;		
		//console.log(layer);
		
		if (layername=='Earthquake (USGS)'){
			Ext.create('MyPath.USGSdata',{
				mappanel:this.mappanel				
			
			}).show();
			
		
		}else{
			if(this.mappanel.map.getLayersByName(layername).length > 0) {				
					this.mappanel.map.getLayersByName(layername)[0].destroy();					
			};					
			
			
			var Layer1 = new OpenLayers.Layer.WMS(
				layername,
				'http://geoserver.namria.gov.ph/geoserver/geoportal/wms', 
				{
					layers:layer,				
					transparent:true						
				},
				{
					//isBaseLayer:false,
					opacity:.7
				}
			); 		
			this.mappanel.map.addLayer(Layer1);		
		}	
		

    },
   
	
    /**
     * Fires the 'selected' event, informing other components that an image has been selected
     */
    fireImageSelected: function() {
        var selectedImage = this.down('iconbrowser').selModel.getSelection()[0];
        //console.log(selectedImage);
        if (selectedImage) {
            this.fireEvent('selected', selectedImage);
            //this.hide();
        }
    }
	
});
